import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Integer,
    Float,
    DateTime,
    ForeignKey,
    Boolean,
    Text,
)
from sqlalchemy.orm import relationship
from server.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="user")  # "user" or "admin"
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)

    feedbacks = relationship(
        "Feedback", back_populates="user", cascade="all, delete-orphan"
    )


class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    rating = Column(Integer, nullable=False)
    feedback_text = Column(Text, nullable=False)
    customer_email = Column(String(255), nullable=True, index=True)
    category = Column(String(100), nullable=True)
    status = Column(
        String(50), default="Processed", nullable=False
    )  # "Processed", "Pending Analysis"
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    user = relationship("User", back_populates="feedbacks")
    sentiment = relationship(
        "SentimentAnalysis",
        back_populates="feedback",
        uselist=False,
        cascade="all, delete-orphan",
    )
    topics = relationship(
        "FeedbackTopic", back_populates="feedback", cascade="all, delete-orphan"
    )
    alerts = relationship(
        "Alert", back_populates="feedback", cascade="all, delete-orphan"
    )


class SentimentAnalysis(Base):
    __tablename__ = "sentiment_analysis"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    feedback_id = Column(
        String(36), ForeignKey("feedback.id"), nullable=False, unique=True
    )
    sentiment = Column(String(20), nullable=False)  # "Positive", "Neutral", "Negative"
    confidence_score = Column(Float, nullable=False, default=0.85)
    summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now, nullable=False)

    feedback = relationship("Feedback", back_populates="sentiment")


class FeedbackTopic(Base):
    __tablename__ = "feedback_topics"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    feedback_id = Column(String(36), ForeignKey("feedback.id"), nullable=False)
    topic_name = Column(String(100), nullable=False)
    sentiment = Column(String(20), nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)

    feedback = relationship("Feedback", back_populates="topics")


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    feedback_id = Column(String(36), ForeignKey("feedback.id"), nullable=False)
    alert_type = Column(
        String(50), nullable=False, default="EMAIL"
    )  # "EMAIL", "WEBHOOK"
    status = Column(
        String(50), nullable=False, default="SENT"
    )  # "SENT", "FAILED", "PENDING"
    retry_count = Column(Integer, nullable=False, default=0)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now, nullable=False)

    feedback = relationship("Feedback", back_populates="alerts")
