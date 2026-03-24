import json
from openai import OpenAI
from app.config import settings
from app.schemas.portfolio import AtsResult
from app.utils.prompts import ATS_SYSTEM, ATS_USER_TEMPLATE

client = OpenAI(
    api_key=settings.XAI_API_KEY,
    base_url="https://api.x.ai/v1"
)

async def score(raw_text: str) -> AtsResult:
    """Score resume for ATS compatibility using Grok API."""
    try:
        message = client.chat.completions.create(
            model="grok-3-mini",
            max_tokens=2048,
            messages=[
                {"role": "system", "content": ATS_SYSTEM},
                {"role": "user", "content": ATS_USER_TEMPLATE.format(raw_text=raw_text)}
            ]
        )
        raw_json = message.choices[0].message.content.strip()
        data = json.loads(raw_json)
        return AtsResult.model_validate(data)
    except json.JSONDecodeError as e:
        raise ValueError(f"AI returned invalid JSON: {str(e)}")
    except Exception as e:
        raise ValueError(f"ATS scoring failed: {str(e)}")
