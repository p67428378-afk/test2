import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from server.database import Base


def generate_uuid():
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    username = Column(String(50), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), default="parent", nullable=False)
    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    progress_logs = relationship(
        "ProgressLog", back_populates="user", cascade="all, delete-orphan"
    )


class LearningItem(Base):
    __tablename__ = "learning_items"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    type = Column(String(20), nullable=False)  # 'alphabet' or 'number'
    value = Column(String(10), nullable=False)  # 'A', '3', etc.
    word_association = Column(String(100), nullable=True)  # 'Apple', 'Three', etc.
    image_url = Column(String(255), nullable=False)
    audio_url = Column(String(255), nullable=False)
    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )

    progress_logs = relationship("ProgressLog", back_populates="learning_item")

    __table_args__ = (UniqueConstraint("type", "value", name="_type_value_uc"),)


class ProgressLog(Base):
    __tablename__ = "progress_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    learning_item_id = Column(
        String(36), ForeignKey("learning_items.id"), nullable=False
    )
    completed_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )

    user = relationship("User", back_populates="progress_logs")
    learning_item = relationship("LearningItem", back_populates="progress_logs")

    __table_args__ = (
        UniqueConstraint("user_id", "learning_item_id", name="_user_item_uc"),
    )
