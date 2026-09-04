import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from server.database import Base


def generate_uuid():
    return str(uuid.uuid4())


def utc_now():
    return datetime.now(timezone.utc)


class Subject(Base):
    __tablename__ = "subjects"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    target_exam_date = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = Column(
        DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False
    )

    topics = relationship(
        "Topic", back_populates="subject", cascade="all, delete-orphan", lazy="selectin"
    )


class Topic(Base):
    __tablename__ = "topics"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    subject_id = Column(
        String(36),
        ForeignKey("subjects.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    title = Column(String(255), nullable=False)
    estimated_minutes = Column(Integer, nullable=False, default=60)
    difficulty = Column(
        String(50), nullable=False, default="Medium"
    )  # Easy, Medium, Hard
    status = Column(
        String(50), nullable=False, default="Not Started"
    )  # Not Started, In Progress, Completed
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = Column(
        DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False
    )

    subject = relationship("Subject", back_populates="topics")
    schedules = relationship(
        "StudySchedule",
        back_populates="topic",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    study_logs = relationship(
        "StudyLog",
        back_populates="topic",
        cascade="all, delete-orphan",
        lazy="selectin",
    )


class StudySchedule(Base):
    __tablename__ = "study_schedules"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    topic_id = Column(
        String(36),
        ForeignKey("topics.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    scheduled_date = Column(DateTime(timezone=True), nullable=False)
    duration_minutes = Column(Integer, nullable=False, default=60)
    is_completed = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = Column(
        DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False
    )

    topic = relationship("Topic", back_populates="schedules")


class DailyStudyGoal(Base):
    __tablename__ = "daily_study_goals"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    target_date = Column(
        String(10), nullable=False, unique=True, index=True
    )  # YYYY-MM-DD
    target_minutes = Column(Integer, nullable=False, default=120)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = Column(
        DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False
    )


class StudyLog(Base):
    __tablename__ = "study_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    topic_id = Column(
        String(36),
        ForeignKey("topics.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    session_minutes = Column(Integer, nullable=False)
    notes = Column(Text, nullable=True)
    logged_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)

    topic = relationship("Topic", back_populates="study_logs")
