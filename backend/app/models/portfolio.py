import uuid
from sqlalchemy import Column, String, Integer, Text, DateTime, Boolean, func, ForeignKey
from sqlalchemy.orm import relationship
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
    
    # Relationship to detailed views
    detailed_views      = relationship("PortfolioView", back_populates="portfolio", cascade="all, delete-orphan")

class PortfolioView(Base):
    __tablename__ = "portfolio_views"

    id           = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    portfolio_id = Column(String, ForeignKey("portfolios.id"), nullable=False)
    timestamp    = Column(DateTime, server_default=func.now())
    ip_hash      = Column(String, nullable=False)  # Hashed IP for uniqueness tracking
    country      = Column(String, nullable=True)
    city         = Column(String, nullable=True)

    portfolio    = relationship("Portfolio", back_populates="detailed_views")

class RankingJob(Base):
    __tablename__ = "ranking_jobs"

    id              = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id         = Column(String, nullable=True)
    job_description = Column(Text, nullable=False)
    created_at      = Column(DateTime, server_default=func.now())

class RankedResume(Base):
    __tablename__ = "ranked_resumes"

    id              = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    job_id          = Column(String, nullable=False)
    filename        = Column(String, nullable=False)
    score           = Column(Integer, nullable=False)
    feedback        = Column(Text, nullable=False) # JSON array
    raw_text        = Column(Text, nullable=True)
