import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Integer,
    Float,
    Text,
    Boolean,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


def generate_uuid() -> str:
    return str(uuid.uuid4())


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default="user", nullable=False)  # 'admin' | 'user'
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = Column(
        DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False
    )


class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    feedback_text = Column(Text, nullable=False)
    rating = Column(Integer, nullable=False)  # 1 to 5
    customer_email = Column(String(255), nullable=True)
    analysis_status = Column(
        String(50), default="Analyzed", nullable=False
    )  # 'Analyzed' | 'Pending Analysis'
    created_at = Column(
        DateTime(timezone=True), default=utc_now, nullable=False, index=True
    )
    updated_at = Column(
        DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False
    )

    sentiment_analysis = relationship(
        "SentimentAnalysis",
        back_populates="feedback",
        uselist=False,
        cascade="all, delete-orphan",
    )
    topics = relationship(
        "FeedbackTopic", back_populates="feedback", cascade="all, delete-orphan"
    )


class SentimentAnalysis(Base):
    __tablename__ = "sentiment_analysis"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    feedback_id = Column(
        String(36),
        ForeignKey("feedback.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    sentiment = Column(
        String(50), nullable=False, index=True
    )  # 'Positive' | 'Neutral' | 'Negative'
    score = Column(Float, nullable=False)  # 0.0 - 1.0
    raw_llm_response = Column(Text, nullable=True)
    processed_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)

    feedback = relationship("Feedback", back_populates="sentiment_analysis")


class FeedbackTopic(Base):
    __tablename__ = "feedback_topics"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    feedback_id = Column(
        String(36),
        ForeignKey("feedback.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    topic_name = Column(String(100), nullable=False, index=True)
    confidence = Column(Float, default=1.0, nullable=False)

    feedback = relationship("Feedback", back_populates="topics")
