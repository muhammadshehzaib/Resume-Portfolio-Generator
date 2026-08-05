import re
from app.schemas.portfolio import ParsedResume
from app.services.llm import chat_json
from app.utils.prompts import EXTRACTION_SYSTEM, EXTRACTION_USER_TEMPLATE

def sanitize_skills(skills: list) -> list[str]:
    cleaned = []
    category_keywords = {
        "databases & orms", "databases and orms", "database & orms", "databases", "database",
        "languages & frameworks", "languages and frameworks", "languages", "language",
        "frameworks & libraries", "frameworks", "tools & devops", "tools & technologies",
        "tools", "technologies", "skills", "core competencies", "technical skills"
    }

    for skill in skills:
        if not skill:
            continue
        skill_str = str(skill).strip()
        skill_str = re.sub(r"^\*+|\*+$", "", skill_str).strip()

        if ":" in skill_str:
            header, content = skill_str.split(":", 1)
            if header.strip().lower() in category_keywords or any(k in header.lower() for k in ["database", "language", "tool", "framework", "skill"]):
                skill_str = content

        sub_items = skill_str.split(",")
        for item in sub_items:
            item_str = item.strip()
            item_str = re.sub(r"^\*+|\*+$", "", item_str).strip()
            if ":" in item_str:
                item_str = item_str.split(":", 1)[-1].strip()
            if not item_str or item_str.lower() in category_keywords:
                continue
            if item_str not in cleaned:
                cleaned.append(item_str)

    return cleaned


async def extract(raw_text: str) -> ParsedResume:
    """Extract structured resume data using the configured AI provider."""
    try:
        data = chat_json(
            system_prompt=EXTRACTION_SYSTEM,
            user_prompt=EXTRACTION_USER_TEMPLATE.format(raw_text=raw_text),
            max_tokens=4096,
        )
        if isinstance(data, dict) and "skills" in data and isinstance(data["skills"], list):
            data["skills"] = sanitize_skills(data["skills"])

        return ParsedResume.model_validate(data)
    except ValueError:
        raise
    except Exception as e:
        raise ValueError(f"Extraction failed: {str(e)}")
