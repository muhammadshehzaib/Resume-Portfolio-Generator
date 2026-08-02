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


def _parse_json_response(raw_text: str) -> dict:
    text = raw_text.strip()

    # Common OSS pattern: JSON wrapped in markdown fences.
    if text.startswith("```"):
        lines = text.splitlines()
        if len(lines) >= 3:
            text = "\n".join(lines[1:-1]).strip()

    try:
        return json.loads(text)
    except json.JSONDecodeError as e:
        print(f"DEBUG: JSONDecodeError on raw text (len {len(text)}): {str(e)}")
        print(f"DEBUG: Context around error: ... {text[max(0, e.pos - 80):min(len(text), e.pos + 80)]} ...")
        
        start = text.find("{")
        end = text.rfind("}")
        if start != -1 and end != -1 and end > start:
            try:
                return json.loads(text[start : end + 1])
            except json.JSONDecodeError as e2:
                print(f"DEBUG: JSONDecodeError on substring (len {end - start + 1}): {str(e2)}")
                sub_text = text[start : end + 1]
                print(f"DEBUG: Substring context around error: ... {sub_text[max(0, e2.pos - 80):min(len(sub_text), e2.pos + 80)]} ...")
                raise ValueError(f"AI returned invalid JSON: {str(e2)}")
        
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
