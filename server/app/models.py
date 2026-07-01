import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from server.app.database import Base


# Helper to generate UUID as string or UUID object depending on DB
def generate_uuid():
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id = Column(
        String(36), primary_key=True, default=generate_uuid, unique=True, nullable=False
    )
    username = Column(String(255), unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    progress = relationship(
        "UserProgress", back_populates="user", cascade="all, delete-orphan"
    )
    badges = relationship(
        "UserBadge", back_populates="user", cascade="all, delete-orphan"
    )


class Activity(Base):
    __tablename__ = "activities"

    id = Column(
        String(36), primary_key=True, default=generate_uuid, unique=True, nullable=False
    )
    module = Column(String(50), nullable=False)  # nutrition, exercise, hygiene
    name = Column(String(255), nullable=False)
    points = Column(Integer, default=100, nullable=False)
    description = Column(String(500), nullable=True)

    progress = relationship(
        "UserProgress", back_populates="activity", cascade="all, delete-orphan"
    )


class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(
        String(36), primary_key=True, default=generate_uuid, unique=True, nullable=False
    )
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    activity_id = Column(String(36), ForeignKey("activities.id"), nullable=False)
    completed_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="progress")
    activity = relationship("Activity", back_populates="progress")

    __table_args__ = (
        UniqueConstraint("user_id", "activity_id", name="uq_user_activity"),
    )


class UserBadge(Base):
    __tablename__ = "user_badges"

    id = Column(
        String(36), primary_key=True, default=generate_uuid, unique=True, nullable=False
    )
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    badge_name = Column(String(255), nullable=False)
    awarded_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="badges")

    __table_args__ = (UniqueConstraint("user_id", "badge_name", name="uq_user_badge"),)
