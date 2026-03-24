import uuid
from sqlalchemy import Column, String, Integer, Text, DateTime, Boolean, func
from app.database import Base

class Portfolio(Base):
    __tablename__ = "portfolios"

    id                  = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id             = Column(String, nullable=True)  # User identifier from auth
    raw_text            = Column(Text, nullable=False)
    parsed_data         = Column(Text, nullable=False)
    ats_score           = Column(Integer, nullable=False)
    ats_feedback        = Column(Text, nullable=False)
    template            = Column(String, default="minimal")
    created_at          = Column(DateTime, server_default=func.now())

    # Feature 1: Profile Photo Upload
    photo_url           = Column(String, nullable=True)

    # Feature 2: Custom Colors
    custom_colors       = Column(Text, nullable=True)  # JSON string: {primaryColor, bgColor}

    # Feature 3: Drag-to-Reorder Sections
    section_order       = Column(Text, nullable=True)  # JSON string: ["experience", "education", ...]

    # Feature 4: Dark/Light Mode
    dark_mode           = Column(Boolean, default=False)

    # Feature 6: Available for Hire Badge
    available_for_hire  = Column(Boolean, default=False)

    # Feature 7: Custom Portfolio Slug
    slug                = Column(String, nullable=True, unique=True)

    # Feature: View Count Analytics
    view_count          = Column(Integer, default=0, nullable=False)
