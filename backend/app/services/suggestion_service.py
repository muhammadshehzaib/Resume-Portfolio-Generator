import json
from openai import OpenAI
from app.config import settings
from app.schemas.portfolio import SuggestionResult
from app.utils.prompts import SUGGESTIONS_SYSTEM, SUGGESTIONS_USER_TEMPLATE

client = OpenAI(
    api_key=settings.XAI_API_KEY,
    base_url="https://api.x.ai/v1"
)

async def analyze(portfolio_data: dict) -> SuggestionResult:
    """Analyze portfolio and return AI-powered improvement suggestions using Grok API."""
    try:
        # Format experiences and education as readable strings
        experiences_str = "\n".join(portfolio_data.get("experiences", []))
        education_str = "\n".join(portfolio_data.get("education", []))
        projects_str = ", ".join(portfolio_data.get("projects", []))

        message = client.chat.completions.create(
            model="grok-3-mini",
            max_tokens=2048,
            messages=[
                {"role": "system", "content": SUGGESTIONS_SYSTEM},
                {"role": "user", "content": SUGGESTIONS_USER_TEMPLATE.format(
                    name=portfolio_data.get("name", "Not provided"),
                    summary=portfolio_data.get("summary", "Not provided"),
                    experience_count=portfolio_data.get("experience_count", 0),
                    experiences=experiences_str or "No experience entries",
                    education=education_str or "No education entries",
                    skills=portfolio_data.get("skills", "No skills listed"),
                    projects=projects_str or "No projects listed",
                    has_photo=portfolio_data.get("has_photo", False),
                    available_for_hire=portfolio_data.get("available_for_hire", False),
                    ats_score=portfolio_data.get("ats_score", 0)
                )}
            ]
        )
        raw_json = message.choices[0].message.content.strip()
        data = json.loads(raw_json)
        return SuggestionResult.model_validate(data)
    except json.JSONDecodeError as e:
        raise ValueError(f"AI returned invalid JSON: {str(e)}")
    except Exception as e:
        raise ValueError(f"Analysis failed: {str(e)}")
