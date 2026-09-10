import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Index, String, Text
from sqlalchemy.orm import relationship

from server.database import Base


class Email(Base):
    __tablename__ = "emails"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    sender = Column(String(255), nullable=True)
    subject = Column(String(500), nullable=True)
    body_text = Column(Text, nullable=False)
    source_type = Column(String(50), nullable=False, default="TEXT_ENTRY")
    file_name = Column(String(255), nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    classification = relationship(
        "Classification",
        back_populates="email",
        uselist=False,
        cascade="all, delete-orphan",
    )

    __table_args__ = (
        Index("ix_emails_created_at", "created_at"),
        Index("ix_emails_subject", "subject"),
    )


class Classification(Base):
    __tablename__ = "classifications"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email_id = Column(
        String(36),
        ForeignKey("emails.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )
    ai_category = Column(String(50), nullable=False)
    confidence_score = Column(Float, nullable=False)
    user_override_category = Column(String(50), nullable=True)
    is_overridden = Column(Boolean, nullable=False, default=False)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    email = relationship("Email", back_populates="classification")

    __table_args__ = (
        Index("ix_classifications_ai_category", "ai_category"),
        Index("ix_classifications_user_override", "user_override_category"),
    )
