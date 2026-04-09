from app.schemas.portfolio import TailorResult
from app.services.llm import chat_json
from app.utils.prompts import TAILOR_SYSTEM, TAILOR_USER_TEMPLATE

async def tailor(summary: str, skills: list[str], job_description: str) -> TailorResult:
    """Tailor portfolio content using the configured AI provider."""
    try:
        data = chat_json(
            system_prompt=TAILOR_SYSTEM,
            user_prompt=TAILOR_USER_TEMPLATE.format(
                summary=summary or "",
                skills=", ".join(skills),
                job_description=job_description
            ),
            max_tokens=2048,
        )
        return TailorResult.model_validate(data)
    except ValueError:
        raise
    except Exception as e:
        raise ValueError(f"Tailoring failed: {str(e)}")
