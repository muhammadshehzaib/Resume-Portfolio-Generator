from pydantic import BaseModel, Field, BeforeValidator
from typing import Optional, Annotated, Any

def coerce_none_to_list(v: Any) -> Any:
    """Coerce None values to an empty list. Useful for AI-generated data."""
    return [] if v is None else v

class ContactInfo(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None

class Experience(BaseModel):
    company: Optional[str] = None
    title: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Annotated[list[str], BeforeValidator(coerce_none_to_list)] = []

class Education(BaseModel):
    institution: Optional[str] = None
    degree: Optional[str] = None
    field: Optional[str] = None
    graduation_year: Optional[str] = None
    gpa: Optional[str] = None

class Project(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    technologies: Annotated[list[str], BeforeValidator(coerce_none_to_list)] = []
    url: Optional[str] = None

class ParsedResume(BaseModel):
    name: Optional[str] = None
    contact: ContactInfo = ContactInfo()
    summary: Optional[str] = None
    experiences: Annotated[list[Experience], BeforeValidator(coerce_none_to_list)] = []
    education: Annotated[list[Education], BeforeValidator(coerce_none_to_list)] = []
    skills: Annotated[list[str], BeforeValidator(coerce_none_to_list)] = []
    projects: Annotated[list[Project], BeforeValidator(coerce_none_to_list)] = []
    certifications: Annotated[list[str], BeforeValidator(coerce_none_to_list)] = []

class AtsResult(BaseModel):
    score: int
    feedback: list[str]

class CustomColors(BaseModel):
    primaryColor: str = "#3b82f6"
    bgColor: str = "#ffffff"

class PortfolioSettings(BaseModel):
    template: Optional[str] = None
    custom_colors: Optional[CustomColors] = None
    section_order: Optional[list[str]] = None
    dark_mode: Optional[bool] = None
    available_for_hire: Optional[bool] = None
    slug: Optional[str] = None

class PortfolioResponse(BaseModel):
    id: str
    parsed_data: ParsedResume
    ats_score: int
    ats_feedback: list[str]
    template: str
    created_at: str
    # New fields for 7 features
    photo_url: Optional[str] = None
    custom_colors: Optional[CustomColors] = None
    section_order: Optional[list[str]] = None
    dark_mode: bool = False
    available_for_hire: bool = False
    slug: Optional[str] = None
    # View Count Analytics
    view_count: int = 0

class TailorRequest(BaseModel):
    job_description: str

class TailorResult(BaseModel):
    tailored_summary: str
    highlighted_skills: list[str]
    skill_match_notes: str

class SuggestionResult(BaseModel):
    issues: list[str]
    improvements: list[str]
    positives: list[str]
    overall_score: int = Field(..., ge=1, le=100)

class GeographicStat(BaseModel):
    country: str
    count: int

class TimeSeriesStat(BaseModel):
    date: str
    views: int
    uniques: int

class AnalyticsResponse(BaseModel):
    total_views: int
    unique_visitors: int
    geographic_stats: list[GeographicStat]
    time_series: list[TimeSeriesStat]

class RankedResumeItem(BaseModel):
    id: str
    filename: str
    score: int
    feedback: list[str]

class RankingJobResponse(BaseModel):
    id: str
    job_description: str
    created_at: str
    results: list[RankedResumeItem]
