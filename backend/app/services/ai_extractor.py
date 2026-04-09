from app.schemas.portfolio import ParsedResume
from app.services.llm import chat_json
from app.utils.prompts import EXTRACTION_SYSTEM, EXTRACTION_USER_TEMPLATE

async def extract(raw_text: str) -> ParsedResume:
    """Extract structured resume data using the configured AI provider."""
    try:
        data = chat_json(
            system_prompt=EXTRACTION_SYSTEM,
            user_prompt=EXTRACTION_USER_TEMPLATE.format(raw_text=raw_text),
            max_tokens=4096,
        )
        return ParsedResume.model_validate(data)
    except ValueError:
        raise
    except Exception as e:
        raise ValueError(f"Extraction failed: {str(e)}")
