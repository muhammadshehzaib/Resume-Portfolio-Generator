import json
from app.services.llm import chat_json, clean_markdown_asterisks

JOB_MATCH_SYSTEM = """You are an expert technical recruiter and ATS specialist.
Analyze the candidate's portfolio data against the provided Job Description.

Your task is to return ONLY a valid JSON object with NO markdown, NO code fences, and NO explanation.

Return this exact JSON structure:
{
  "match_score": <integer 0-100 representing job fit>,
  "matched_skills": [
    {"name": "<matched skill name>", "importance": "high" | "medium" | "low"}
  ],
  "missing_skills": [
    {"name": "<missing skill required by job>", "importance": "high" | "medium", "suggestion": "<actionable advice on how to highlight or acquire this skill>"}
  ],
  "strengths": [
    "<specific candidate strength matching the role>"
  ],
  "improvements": [
    "<specific improvement to make candidate a 100% fit>"
  ],
  "suggested_bullet_rewrites": [
    "<rewritten bullet point demonstrating missing skills and keywords>"
  ]
}
"""

JOB_MATCH_USER_TEMPLATE = """Evaluate this candidate against the job description:

---CANDIDATE PORTFOLIO DATA---
Name: {name}
Summary: {summary}
Skills: {skills}
Experiences: {experiences}
Projects: {projects}
---CANDIDATE PORTFOLIO END---

---TARGET JOB DESCRIPTION---
{job_description}
---TARGET JOB DESCRIPTION END---
"""


COVER_LETTER_SYSTEM = """You are an expert executive career coach and professional copywriter.
Generate a compelling, highly personalized 3-paragraph Cover Letter tailored specifically to the target Job Description and Candidate's experience.

INSTRUCTIONS:
1. Paragraph 1: Enthusiastic hook expressing interest in the role, mentioning candidate's primary background.
2. Paragraph 2: Core technical achievements and project highlights directly matching job requirements.
3. Paragraph 3: Professional closing with call to action for an interview.
4. DO NOT use markdown bolding with asterisks (such as **Name**). Use clean plain text formatting.

Return ONLY a valid JSON object matching this exact schema:
{
  "company_name": "<company name from job description or Target Company>",
  "job_title": "<job title from job description or Target Role>",
  "cover_letter_text": "<full multi-paragraph plain text cover letter>"
}
"""

COVER_LETTER_USER_TEMPLATE = """Generate a tailored cover letter for this role:

---CANDIDATE DATA---
Name: {name}
Email: {email}
Location: {location}
Summary: {summary}
Skills: {skills}
Experiences: {experiences}
Projects: {projects}
---CANDIDATE DATA END---

---JOB DESCRIPTION---
{job_description}
---JOB DESCRIPTION END---
"""


def analyze_job_match(parsed_data: dict, job_description: str) -> dict:
    """Analyze candidate fit against a job description and return heatmap data."""
    name = parsed_data.get("name", "Candidate")
    summary = parsed_data.get("summary", "")
    skills = json.dumps(parsed_data.get("skills", []))
    experiences = json.dumps(parsed_data.get("experiences", []))
    projects = json.dumps(parsed_data.get("projects", []))

    user_prompt = JOB_MATCH_USER_TEMPLATE.format(
        name=name,
        summary=summary,
        skills=skills,
        experiences=experiences,
        projects=projects,
        job_description=job_description
    )

    data = chat_json(system_prompt=JOB_MATCH_SYSTEM, user_prompt=user_prompt, max_tokens=2048)
    return data


def generate_cover_letter(parsed_data: dict, job_description: str) -> dict:
    """Generate a tailored cover letter based on portfolio data and job description."""
    contact = parsed_data.get("contact", {})
    name = parsed_data.get("name", "Candidate")
    email = contact.get("email", "")
    location = contact.get("location", "")
    summary = parsed_data.get("summary", "")
    skills = json.dumps(parsed_data.get("skills", []))
    experiences = json.dumps(parsed_data.get("experiences", []))
    projects = json.dumps(parsed_data.get("projects", []))

    user_prompt = COVER_LETTER_USER_TEMPLATE.format(
        name=name,
        email=email,
        location=location,
        summary=summary,
        skills=skills,
        experiences=experiences,
        projects=projects,
        job_description=job_description
    )

    data = chat_json(system_prompt=COVER_LETTER_SYSTEM, user_prompt=user_prompt, max_tokens=2048)
    if isinstance(data, dict) and "cover_letter_text" in data:
        data["cover_letter_text"] = clean_markdown_asterisks(data["cover_letter_text"])
    return data
