"""SQLAlchemy models for TaskFlow platform."""

import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    String,
    Text,
)
from sqlalchemy.orm import relationship
from server.database import Base


def get_utc_now():
    return datetime.now(timezone.utc)


class User(Base):
    """User account model."""

    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="Member", nullable=False)  # Admin, Member
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=get_utc_now, nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=get_utc_now,
        onupdate=get_utc_now,
        nullable=False,
    )

    projects = relationship(
        "Project", back_populates="owner", cascade="all, delete-orphan"
    )
    tasks = relationship("Task", back_populates="assignee")
    comments = relationship(
        "Comment", back_populates="author", cascade="all, delete-orphan"
    )
    escalation_logs = relationship("EscalationLog", back_populates="notified_user")


class Project(Base):
    """Project management model."""

    __tablename__ = "projects"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(
        String(50), default="Planning", nullable=False
    )  # Planning, In Progress, On Hold, Completed
    owner_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=get_utc_now, nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=get_utc_now,
        onupdate=get_utc_now,
        nullable=False,
    )

    owner = relationship("User", back_populates="projects")
    tasks = relationship("Task", back_populates="project", cascade="all, delete-orphan")
    escalation_logs = relationship("EscalationLog", back_populates="project")


class Task(Base):
    """Task item model."""

    __tablename__ = "tasks"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False)
    assignee_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    summary = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    priority = Column(
        String(50), default="Medium", nullable=False
    )  # Low, Medium, High, Urgent
    status = Column(
        String(50), default="To Do", nullable=False
    )  # To Do, In Progress, Done, Completed
    due_date = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=get_utc_now, nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=get_utc_now,
        onupdate=get_utc_now,
        nullable=False,
    )
    completed_at = Column(DateTime(timezone=True), nullable=True)

    project = relationship("Project", back_populates="tasks")
    assignee = relationship("User", back_populates="tasks")
    comments = relationship(
        "Comment", back_populates="task", cascade="all, delete-orphan"
    )
    escalation_logs = relationship(
        "EscalationLog", back_populates="task", cascade="all, delete-orphan"
    )


class Comment(Base):
    """Task comment model."""

    __tablename__ = "comments"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    task_id = Column(String(36), ForeignKey("tasks.id"), nullable=False)
    author_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    body = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), default=get_utc_now, nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=get_utc_now,
        onupdate=get_utc_now,
        nullable=False,
    )

    task = relationship("Task", back_populates="comments")
    author = relationship("User", back_populates="comments")


class EscalationLog(Base):
    """Escalation trigger log model."""

    __tablename__ = "escalation_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    task_id = Column(String(36), ForeignKey("tasks.id"), nullable=False)
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=True)
    reason = Column(String(255), nullable=False)
    notified_user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), default=get_utc_now, nullable=False)

    task = relationship("Task", back_populates="escalation_logs")
    project = relationship("Project", back_populates="escalation_logs")
    notified_user = relationship("User", back_populates="escalation_logs")
