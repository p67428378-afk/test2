import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, JSON
from server.database import Base


class ResumeModel(Base):
    __tablename__ = "resumes"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    portfolio_url = Column(String(500), nullable=True)
    template_id = Column(String(50), nullable=False, default="classic")
    experiences = Column(JSON, nullable=False, default=list)
    education = Column(JSON, nullable=False, default=list)
    skills = Column(JSON, nullable=False, default=list)
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc)
    )
    updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )
