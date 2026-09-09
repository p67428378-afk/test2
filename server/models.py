import uuid
from datetime import datetime
from sqlalchemy import (
    Column,
    String,
    Integer,
    Text,
    DateTime,
    ForeignKey,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
from server.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class Pose(Base):
    __tablename__ = "poses"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    english_name = Column(String(255), nullable=False, index=True)
    sanskrit_name = Column(String(255), nullable=True, index=True)
    difficulty = Column(
        String(50), nullable=False, index=True
    )  # Beginner, Intermediate, Advanced
    category = Column(
        String(50), nullable=False, index=True
    )  # Standing, Seated, Inversion, Balance, Restorative
    alignment_cues = Column(Text, nullable=True)
    breath_instructions = Column(Text, nullable=True)
    target_muscles = Column(Text, nullable=True)
    common_mistakes = Column(Text, nullable=True)
    image_url = Column(Text, nullable=True)
    video_url = Column(Text, nullable=True)
    created_at = Column(
        DateTime(timezone=True), default=datetime.utcnow, nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    routine_items = relationship(
        "RoutinePose", back_populates="pose", cascade="all, delete-orphan"
    )
    favorites = relationship(
        "UserFavorite", back_populates="pose", cascade="all, delete-orphan"
    )


class Routine(Base):
    __tablename__ = "routines"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    total_duration_seconds = Column(Integer, default=0, nullable=False)
    created_at = Column(
        DateTime(timezone=True), default=datetime.utcnow, nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    poses = relationship(
        "RoutinePose",
        back_populates="routine",
        cascade="all, delete-orphan",
        order_by="RoutinePose.sequence_order",
    )
    practice_sessions = relationship("PracticeSession", back_populates="routine")


class RoutinePose(Base):
    __tablename__ = "routine_poses"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    routine_id = Column(
        String(36),
        ForeignKey("routines.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    pose_id = Column(
        String(36),
        ForeignKey("poses.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    sequence_order = Column(Integer, nullable=False, default=1)
    hold_duration_seconds = Column(Integer, nullable=False, default=30)
    transition_notes = Column(Text, nullable=True)
    created_at = Column(
        DateTime(timezone=True), default=datetime.utcnow, nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    routine = relationship("Routine", back_populates="poses")
    pose = relationship("Pose", back_populates="routine_items")


class UserFavorite(Base):
    __tablename__ = "user_favorites"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(255), nullable=False, default="default_user", index=True)
    pose_id = Column(
        String(36),
        ForeignKey("poses.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    created_at = Column(
        DateTime(timezone=True), default=datetime.utcnow, nullable=False
    )

    pose = relationship("Pose", back_populates="favorites")

    __table_args__ = (
        UniqueConstraint("user_id", "pose_id", name="uq_user_pose_favorite"),
    )


class PracticeSession(Base):
    __tablename__ = "practice_sessions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(255), nullable=False, default="default_user", index=True)
    routine_id = Column(
        String(36),
        ForeignKey("routines.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    completed_duration_seconds = Column(Integer, nullable=False)
    poses_completed = Column(Integer, nullable=False)
    notes = Column(Text, nullable=True)
    completed_at = Column(
        DateTime(timezone=True), default=datetime.utcnow, nullable=False
    )

    routine = relationship("Routine", back_populates="practice_sessions")
