import json
from typing import List
from app.services.llm import chat_json
from app.utils.prompts import RANKING_SYSTEM, RANKING_USER_TEMPLATE
from app.schemas.portfolio import AtsResult

async def rank_resume(raw_text: str, job_description: str) -> AtsResult:
    """Evaluate a single resume against a job description using AI."""
    try:
        data = chat_json(
            system_prompt=RANKING_SYSTEM,
            user_prompt=RANKING_USER_TEMPLATE.format(
                raw_text=raw_text, 
                job_description=job_description
            ),
            max_tokens=2048,
        )
        return AtsResult.model_validate(data)
    except Exception as e:
        raise ValueError(f"Ranking failed: {str(e)}")
