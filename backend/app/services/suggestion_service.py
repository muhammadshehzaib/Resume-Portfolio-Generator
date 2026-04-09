from app.schemas.portfolio import SuggestionResult
from app.services.llm import chat_json
from app.utils.prompts import SUGGESTIONS_SYSTEM, SUGGESTIONS_USER_TEMPLATE

async def analyze(portfolio_data: dict) -> SuggestionResult:
    """Analyze portfolio and return suggestions using the configured AI provider."""
    try:
        # Format experiences and education as readable strings
        experiences_str = "\n".join(portfolio_data.get("experiences", []))
        education_str = "\n".join(portfolio_data.get("education", []))
        projects_str = ", ".join(portfolio_data.get("projects", []))

        data = chat_json(
            system_prompt=SUGGESTIONS_SYSTEM,
            user_prompt=SUGGESTIONS_USER_TEMPLATE.format(
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
            ),
            max_tokens=2048,
        )
        return SuggestionResult.model_validate(data)
    except ValueError:
        raise
    except Exception as e:
        raise ValueError(f"Analysis failed: {str(e)}")
