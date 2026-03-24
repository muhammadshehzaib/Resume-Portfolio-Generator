from pydantic import BaseModel
from typing import Optional

class ContactInfo(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None

class Experience(BaseModel):
    company: str
    title: str
    start_date: str
    end_date: Optional[str] = None
    description: list[str] = []

class Education(BaseModel):
    institution: str
    degree: str
    field: Optional[str] = None
    graduation_year: Optional[str] = None
    gpa: Optional[str] = None

class Project(BaseModel):
    name: str
    description: str
    technologies: list[str] = []
    url: Optional[str] = None

class ParsedResume(BaseModel):
    name: Optional[str] = None
    contact: ContactInfo = ContactInfo()
    summary: Optional[str] = None
    experiences: list[Experience] = []
    education: list[Education] = []
    skills: list[str] = []
    projects: list[Project] = []
    certifications: list[str] = []

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
