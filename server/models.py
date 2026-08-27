import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from server.database import Base


def utc_now():
    return datetime.now(timezone.utc)


class Project(Base):
    __tablename__ = "projects"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(255), nullable=False)
    summary = Column(Text, nullable=False)
    full_description = Column(Text, nullable=True)
    thumbnail_url = Column(Text, nullable=True)
    gallery_images = Column(JSON, nullable=True, default=list)
    live_demo_url = Column(Text, nullable=True)
    github_url = Column(Text, nullable=True)
    client_context = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = Column(
        DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False
    )

    tags = relationship(
        "ProjectTag",
        back_populates="project",
        cascade="all, delete-orphan",
        lazy="selectin",
    )


class ProjectTag(Base):
    __tablename__ = "project_tags"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(
        String(36),
        ForeignKey("projects.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    tag = Column(String(50), nullable=False, index=True)

    project = relationship("Project", back_populates="tags")


class Lead(Base):
    __tablename__ = "leads"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    client_name = Column(String(150), nullable=False)
    email = Column(String(255), nullable=False, index=True)
    budget_range = Column(String(100), nullable=False)
    message = Column(Text, nullable=False)
    status = Column(String(50), default="new", nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = Column(
        DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False
    )
