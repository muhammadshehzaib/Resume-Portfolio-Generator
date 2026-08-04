import json
import time
from openai import OpenAI, APIConnectionError, APITimeoutError
from app.config import settings


def _build_client() -> OpenAI:
    provider = settings.AI_PROVIDER.lower()

    if provider == "ollama":
        return OpenAI(
            api_key=settings.OPENAI_API_KEY or "ollama",
            base_url=settings.AI_BASE_URL or "http://localhost:11434/v1",
            timeout=120,
        )

    if provider == "openai":
        if not settings.OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY is required when AI_PROVIDER=openai")
        kwargs = {"api_key": settings.OPENAI_API_KEY}
        if settings.AI_BASE_URL:
            kwargs["base_url"] = settings.AI_BASE_URL
        kwargs["timeout"] = 120
        return OpenAI(**kwargs)

    if provider == "openai_compatible":
        if not settings.AI_BASE_URL:
            raise ValueError("AI_BASE_URL is required when AI_PROVIDER=openai_compatible")
        return OpenAI(
            api_key=settings.OPENAI_API_KEY or "compat-key",
            base_url=settings.AI_BASE_URL,
            timeout=120,
        )

    if provider == "huggingface":
        if not settings.OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY (HF token) is required when AI_PROVIDER=huggingface")
        return OpenAI(
            api_key=settings.OPENAI_API_KEY,
            base_url=settings.AI_BASE_URL or "https://router.huggingface.co/v1",
            timeout=120,
        )

    raise ValueError(
        "Unsupported AI_PROVIDER. Use one of: ollama, openai, openai_compatible, huggingface"
    )


client = _build_client()


def repair_json(s: str) -> str:
    """
    Repair common JSON formatting issues from LLM responses:
    - Escapes unescaped double quotes inside string values.
    - Escapes raw newlines/carriage returns inside string values.
    """
    result = []
    inside_string = False
    i = 0
    n = len(s)
    
    valid_json_starts = set('"{[tfn-0123456789')
    
    while i < n:
        char = s[i]
        
        # Keep escaped characters as-is
        if char == '\\' and i + 1 < n:
            result.append(s[i:i+2])
            i += 2
            continue
            
        if char == '"':
            if not inside_string:
                inside_string = True
                result.append(char)
                i += 1
            else:
                # Determine if this double quote closes the string or is an unescaped internal quote.
                # A closing quote MUST be followed by:
                # - Optional whitespace, then ':' (end of key)
                # - Optional whitespace, then '}' (end of object)
                # - Optional whitespace, then ']' (end of array)
                # - Optional whitespace, then ',' AND after the comma, a valid JSON value/key start
                # - End of document
                next_idx = -1
                for j in range(i + 1, n):
                    if not s[j].isspace():
                        next_idx = j
                        break
                
                is_closing = False
                if next_idx == -1:
                    is_closing = True
                else:
                    next_char = s[next_idx]
                    if next_char in (':', '}', ']'):
                        is_closing = True
                    elif next_char == ',':
                        after_comma_char = None
                        for k in range(next_idx + 1, n):
                            if not s[k].isspace():
                                after_comma_char = s[k]
                                break
                        if after_comma_char is None or after_comma_char in valid_json_starts or after_comma_char in ('}', ']'):
                            is_closing = True
                
                if is_closing:
                    inside_string = False
                    result.append(char)
                else:
                    result.append('\\"')
                i += 1
        elif char in ('\n', '\r') and inside_string:
            if char == '\n':
                result.append('\\n')
            else:
                result.append('\\r')
            i += 1
        else:
            result.append(char)
            i += 1
            
    return "".join(result)


def _parse_json_response(raw_text: str) -> dict:
    text = raw_text.strip()

    # Common OSS pattern: JSON wrapped in markdown fences.
    if text.startswith("```"):
        lines = text.splitlines()
        if len(lines) >= 3:
            text = "\n".join(lines[1:-1]).strip()

    # Try 1: Try parsing direct text
    try:
        return json.loads(text)
    except json.JSONDecodeError as e:
        print(f"DEBUG: JSONDecodeError on raw text (len {len(text)}): {str(e)}")
        
        # Try 2: Try parsing repaired direct text
        try:
            repaired = repair_json(text)
            return json.loads(repaired)
        except json.JSONDecodeError as e_repair:
            print(f"DEBUG: JSONDecodeError on repaired text: {str(e_repair)}")
            
            # Try 3: Try extracting {...} substring
            start = text.find("{")
            end = text.rfind("}")
            if start != -1 and end != -1 and end > start:
                substring = text[start : end + 1]
                try:
                    return json.loads(substring)
                except json.JSONDecodeError as e2:
                    # Try 4: Try parsing repaired substring
                    try:
                        repaired_sub = repair_json(substring)
                        return json.loads(repaired_sub)
                    except json.JSONDecodeError as e3:
                        print(f"DEBUG: JSONDecodeError on repaired substring: {str(e3)}")
                        raise ValueError(f"AI returned invalid JSON: {str(e3)}")
            
            raise ValueError("AI returned invalid JSON")


def chat_json(system_prompt: str, user_prompt: str, max_tokens: int) -> dict:
    last_error: Exception | None = None
    for attempt in range(3):
        try:
            kwargs = {
                "model": settings.AI_MODEL,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
            }
            if max_tokens:
                kwargs["max_tokens"] = max_tokens

            # Enable structured JSON output mode for OpenAI and Gemini models
            provider = settings.AI_PROVIDER.lower()
            if provider == "openai" or "gemini" in settings.AI_MODEL.lower():
                kwargs["response_format"] = {"type": "json_object"}

            message = client.chat.completions.create(**kwargs)
            break
        except (APIConnectionError, APITimeoutError) as e:
            last_error = e
            if attempt < 2:
                time.sleep(1 + attempt)
                continue
            raise ValueError(f"LLM request failed after retries: {type(e).__name__}: {str(e)}")
        except Exception as e:
            raise ValueError(f"LLM request failed: {type(e).__name__}: {str(e)}")
    else:
        raise ValueError(f"LLM request failed: {type(last_error).__name__}: {str(last_error)}")

    raw_json = message.choices[0].message.content
    if not raw_json:
        raise ValueError("AI returned an empty response")

    if isinstance(raw_json, list):
        raw_json = "".join(
            part.get("text", "") if isinstance(part, dict) else str(part)
            for part in raw_json
        )

    return _parse_json_response(raw_json)
