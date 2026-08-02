import uuid
from sqlalchemy import Column, String, DateTime, func
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id              = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email           = Column(String, unique=True, index=True, nullable=False)
    name            = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role            = Column(String, nullable=False, default="job_seeker")  # "job_seeker" or "recruiter"
    created_at      = Column(DateTime, server_default=func.now())
