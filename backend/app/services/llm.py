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
    except json.JSONDecodeError:
        pass

    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1 and end > start:
        return json.loads(text[start : end + 1])

    raise ValueError("AI returned invalid JSON")


def chat_json(system_prompt: str, user_prompt: str, max_tokens: int) -> dict:
    last_error: Exception | None = None
    for attempt in range(3):
        try:
            message = client.chat.completions.create(
                model=settings.AI_MODEL,
                max_tokens=max_tokens,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
            )
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
