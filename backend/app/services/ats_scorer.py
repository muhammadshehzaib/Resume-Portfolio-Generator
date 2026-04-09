from app.schemas.portfolio import AtsResult
from app.services.llm import chat_json
from app.utils.prompts import ATS_SYSTEM, ATS_USER_TEMPLATE

async def score(raw_text: str) -> AtsResult:
    """Score resume for ATS compatibility using the configured AI provider."""
    try:
        data = chat_json(
            system_prompt=ATS_SYSTEM,
            user_prompt=ATS_USER_TEMPLATE.format(raw_text=raw_text),
            max_tokens=2048,
        )
        return AtsResult.model_validate(data)
    except ValueError:
        raise
    except Exception as e:
        raise ValueError(f"ATS scoring failed: {str(e)}")
