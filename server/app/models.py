"""
Module: models
Purpose: SQLAlchemy database models for users and tasks
"""

import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from server.app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(
        String, primary_key=True, default=lambda: str(uuid.uuid4()), unique=True
    )
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="member")
    created_at = Column(
        DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    assigned_tasks = relationship(
        "Task", back_populates="assignee", foreign_keys="Task.assignee_id"
    )
    reported_tasks = relationship(
        "Task", back_populates="reporter", foreign_keys="Task.reporter_id"
    )


class Task(Base):
    __tablename__ = "tasks"

    id = Column(
        String, primary_key=True, default=lambda: str(uuid.uuid4()), unique=True
    )
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(50), nullable=False, default="To Do")
    priority = Column(String(50), nullable=False, default="Med")
    due_date = Column(DateTime, nullable=False)
    assignee_id = Column(String, ForeignKey("users.id"), nullable=True)
    reporter_id = Column(String, ForeignKey("users.id"), nullable=False)
    created_at = Column(
        DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    updated_at = Column(
        DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    assignee = relationship(
        "User", back_populates="assigned_tasks", foreign_keys=[assignee_id]
    )
    reporter = relationship(
        "User", back_populates="reported_tasks", foreign_keys=[reporter_id]
    )
