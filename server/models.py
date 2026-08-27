"""SQLAlchemy data models."""

import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, DateTime, String, Text
from server.database import Base


class Document(Base):
    """Document model storing Markdown documents."""

    __tablename__ = "documents"

    id = Column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        index=True,
    )
    title = Column(
        String(255),
        nullable=False,
        default="Untitled Document",
    )
    content = Column(
        Text,
        nullable=False,
        default="",
    )
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )
    updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
