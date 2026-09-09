import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Integer,
    Boolean,
    DateTime,
    Text,
    ForeignKey,
)
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()


def utc_now():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    role = Column(String(50), default="user", nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = Column(
        DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False
    )

    plants = relationship(
        "UserPlant", back_populates="user", cascade="all, delete-orphan"
    )


class Species(Base):
    __tablename__ = "species"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    common_name = Column(String(255), index=True, nullable=False)
    scientific_name = Column(String(255), index=True, nullable=True)
    sunlight_requirement = Column(String(255), nullable=False)
    humidity_requirement = Column(String(255), nullable=False)
    recommended_watering_days = Column(Integer, nullable=False, default=7)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)

    plants = relationship("UserPlant", back_populates="species")


class UserPlant(Base):
    __tablename__ = "user_plants"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    species_id = Column(
        String(36),
        ForeignKey("species.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    nickname = Column(String(255), nullable=False)
    location = Column(String(255), nullable=True)
    photo_url = Column(Text, nullable=True)
    watering_interval_days = Column(Integer, nullable=False, default=7)
    last_watered = Column(DateTime(timezone=True), nullable=True)
    next_due_date = Column(DateTime(timezone=True), nullable=True, index=True)
    notifications_enabled = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = Column(
        DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False
    )

    user = relationship("User", back_populates="plants")
    species = relationship("Species", back_populates="plants")
    watering_logs = relationship(
        "WateringLog",
        back_populates="plant",
        cascade="all, delete-orphan",
        order_by="desc(WateringLog.watered_at)",
    )


class WateringLog(Base):
    __tablename__ = "watering_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    plant_id = Column(
        String(36),
        ForeignKey("user_plants.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    watered_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)

    plant = relationship("UserPlant", back_populates="watering_logs")
