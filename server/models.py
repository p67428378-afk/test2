import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Text, JSON, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


def generate_uuid() -> str:
    return str(uuid.uuid4())


def get_utc_now() -> datetime:
    return datetime.now(timezone.utc)


class Pose(Base):
    __tablename__ = "poses"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    english_name = Column(String(255), nullable=False, index=True)
    sanskrit_name = Column(String(255), nullable=False, index=True)
    difficulty = Column(
        String(50), nullable=False, index=True
    )  # Beginner, Intermediate, Advanced
    category = Column(
        String(50), nullable=False, index=True
    )  # Standing, Seated, Inversion, Balance, Restorative
    alignment_cues = Column(JSON, nullable=False, default=list)
    breath_instructions = Column(Text, nullable=True)
    target_muscles = Column(JSON, nullable=True, default=list)
    common_mistakes = Column(JSON, nullable=True, default=list)
    image_url = Column(String(512), nullable=True)
    video_url = Column(String(512), nullable=True)
    created_at = Column(DateTime(timezone=True), default=get_utc_now)
    updated_at = Column(
        DateTime(timezone=True), default=get_utc_now, onupdate=get_utc_now
    )

    routine_items = relationship(
        "RoutinePose", back_populates="pose", cascade="all, delete-orphan"
    )


class Routine(Base):
    __tablename__ = "routines"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    total_duration_seconds = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime(timezone=True), default=get_utc_now)
    updated_at = Column(
        DateTime(timezone=True), default=get_utc_now, onupdate=get_utc_now
    )

    items = relationship(
        "RoutinePose",
        back_populates="routine",
        cascade="all, delete-orphan",
        order_by="RoutinePose.sequence_order",
    )


class RoutinePose(Base):
    __tablename__ = "routine_poses"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    routine_id = Column(
        String(36), ForeignKey("routines.id", ondelete="CASCADE"), nullable=False
    )
    pose_id = Column(
        String(36), ForeignKey("poses.id", ondelete="RESTRICT"), nullable=False
    )
    sequence_order = Column(Integer, nullable=False)
    hold_duration_seconds = Column(Integer, nullable=False, default=30)
    transition_notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=get_utc_now)
    updated_at = Column(
        DateTime(timezone=True), default=get_utc_now, onupdate=get_utc_now
    )

    routine = relationship("Routine", back_populates="items")
    pose = relationship("Pose", back_populates="routine_items")
