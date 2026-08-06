import uuid
from datetime import datetime, date
from typing import Optional, List
from sqlalchemy import (
    String,
    DateTime,
    Date,
    Boolean,
    ForeignKey,
    Integer,
    UniqueConstraint,
    Text,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from server.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    email: Mapped[Optional[str]] = mapped_column(
        String(255), unique=True, index=True, nullable=True
    )
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    role: Mapped[str] = mapped_column(
        String(50), default="child", nullable=False
    )  # 'child', 'parent', 'admin'
    is_parent_verified: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    parent_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=True
    )
    total_points: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    habit_logs: Mapped[List["HabitLog"]] = relationship(
        "HabitLog", back_populates="user", cascade="all, delete-orphan"
    )
    streak: Mapped[Optional["Streak"]] = relationship(
        "Streak", back_populates="user", uselist=False, cascade="all, delete-orphan"
    )
    user_badges: Mapped[List["UserBadge"]] = relationship(
        "UserBadge", back_populates="user", cascade="all, delete-orphan"
    )
    parent: Mapped[Optional["User"]] = relationship(
        "User", remote_side=[id], backref="children"
    )


class Habit(Base):
    __tablename__ = "habits"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    category: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    points_value: Mapped[int] = mapped_column(Integer, default=10, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=func.now(), nullable=False
    )

    logs: Mapped[List["HabitLog"]] = relationship(
        "HabitLog", back_populates="habit", cascade="all, delete-orphan"
    )


class HabitLog(Base):
    __tablename__ = "habit_logs"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), index=True, nullable=False
    )
    habit_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("habits.id"), index=True, nullable=False
    )
    completed_at: Mapped[datetime] = mapped_column(
        DateTime, default=func.now(), nullable=False
    )
    local_date: Mapped[date] = mapped_column(Date, index=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=func.now(), nullable=False
    )

    __table_args__ = (
        UniqueConstraint(
            "user_id", "habit_id", "local_date", name="uix_user_habit_date"
        ),
    )

    user: Mapped["User"] = relationship("User", back_populates="habit_logs")
    habit: Mapped["Habit"] = relationship("Habit", back_populates="logs")


class Streak(Base):
    __tablename__ = "streaks"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False
    )
    current_streak: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    longest_streak: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    last_logged_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    user: Mapped["User"] = relationship("User", back_populates="streak")


class Badge(Base):
    __tablename__ = "badges"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    required_points: Mapped[int] = mapped_column(Integer, nullable=False, default=100)
    icon_key: Mapped[str] = mapped_column(
        String(100), nullable=False, default="badge_default"
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=func.now(), nullable=False
    )

    user_badges: Mapped[List["UserBadge"]] = relationship(
        "UserBadge", back_populates="badge", cascade="all, delete-orphan"
    )


class UserBadge(Base):
    __tablename__ = "user_badges"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), index=True, nullable=False
    )
    badge_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("badges.id"), index=True, nullable=False
    )
    awarded_at: Mapped[datetime] = mapped_column(
        DateTime, default=func.now(), nullable=False
    )

    user: Mapped["User"] = relationship("User", back_populates="user_badges")
    badge: Mapped["Badge"] = relationship("Badge", back_populates="user_badges")


class Lesson(Base):
    __tablename__ = "lessons"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    content: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    quiz_question: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    quiz_options: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    correct_answer: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    points_value: Mapped[int] = mapped_column(Integer, default=10, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=func.now(), nullable=False
    )
