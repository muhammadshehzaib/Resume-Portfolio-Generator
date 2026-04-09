import json
from openai import OpenAI
from app.config import settings


def _build_client() -> OpenAI:
    provider = settings.AI_PROVIDER.lower()

    if provider == "ollama":
        return OpenAI(
            api_key=settings.OPENAI_API_KEY or "ollama",
            base_url=settings.AI_BASE_URL or "http://localhost:11434/v1",
        )

    if provider == "openai":
        if not settings.OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY is required when AI_PROVIDER=openai")
        kwargs = {"api_key": settings.OPENAI_API_KEY}
        if settings.AI_BASE_URL:
            kwargs["base_url"] = settings.AI_BASE_URL
        return OpenAI(**kwargs)

    if provider == "openai_compatible":
        if not settings.AI_BASE_URL:
            raise ValueError("AI_BASE_URL is required when AI_PROVIDER=openai_compatible")
        return OpenAI(
            api_key=settings.OPENAI_API_KEY or "compat-key",
            base_url=settings.AI_BASE_URL,
        )

    raise ValueError(
        "Unsupported AI_PROVIDER. Use one of: ollama, openai, openai_compatible"
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
    message = client.chat.completions.create(
        model=settings.AI_MODEL,
        max_tokens=max_tokens,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
    )

    raw_json = message.choices[0].message.content
    if not raw_json:
        raise ValueError("AI returned an empty response")

    if isinstance(raw_json, list):
        raw_json = "".join(
            part.get("text", "") if isinstance(part, dict) else str(part)
            for part in raw_json
        )

    return _parse_json_response(raw_json)
