import json
from openai import OpenAI
from app.config import settings
from app.schemas.portfolio import TailorResult
from app.utils.prompts import TAILOR_SYSTEM, TAILOR_USER_TEMPLATE

client = OpenAI(
    api_key=settings.XAI_API_KEY,
    base_url="https://api.x.ai/v1"
)

async def tailor(summary: str, skills: list[str], job_description: str) -> TailorResult:
    """Tailor portfolio content to a specific job description using Grok API."""
    try:
        message = client.chat.completions.create(
            model="grok-3-mini",
            max_tokens=2048,
            messages=[
                {"role": "system", "content": TAILOR_SYSTEM},
                {"role": "user", "content": TAILOR_USER_TEMPLATE.format(
                    summary=summary or "",
                    skills=", ".join(skills),
                    job_description=job_description
                )}
            ]
        )
        raw_json = message.choices[0].message.content.strip()
        data = json.loads(raw_json)
        return TailorResult.model_validate(data)
    except json.JSONDecodeError as e:
        raise ValueError(f"AI returned invalid JSON: {str(e)}")
    except Exception as e:
        raise ValueError(f"Tailoring failed: {str(e)}")
