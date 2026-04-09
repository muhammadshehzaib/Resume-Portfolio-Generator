import json
from openai import OpenAI
from app.config import settings
from app.schemas.portfolio import ParsedResume
from app.utils.prompts import EXTRACTION_SYSTEM, EXTRACTION_USER_TEMPLATE

client = OpenAI(
    api_key=settings.OPENAI_API_KEY,
)

async def extract(raw_text: str) -> ParsedResume:
    """Extract structured resume data using OpenAI."""
    try:
        message = client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            max_tokens=4096,
            messages=[
                {"role": "system", "content": EXTRACTION_SYSTEM},
                {"role": "user", "content": EXTRACTION_USER_TEMPLATE.format(raw_text=raw_text)}
            ]
        )
        raw_json = message.choices[0].message.content.strip()
        data = json.loads(raw_json)
        return ParsedResume.model_validate(data)
    except json.JSONDecodeError as e:
        raise ValueError(f"AI returned invalid JSON: {str(e)}")
    except Exception as e:
        raise ValueError(f"Extraction failed: {str(e)}")
