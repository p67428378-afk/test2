import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Integer,
    Boolean,
    Text,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from server.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    role = Column(String, default="user")
    is_active = Column(Boolean, default=True)
    created_at = Column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    plants = relationship(
        "UserPlant", back_populates="user", cascade="all, delete-orphan"
    )
    health_logs = relationship(
        "PlantHealthLog", back_populates="user", cascade="all, delete-orphan"
    )
    custom_species = relationship("Species", back_populates="creator")


class Species(Base):
    __tablename__ = "species"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    common_name = Column(String, index=True, nullable=False)
    scientific_name = Column(String, index=True, nullable=True)
    sunlight_requirement = Column(String, default="Bright Indirect Light")
    light_requirement = Column(String, nullable=True)
    humidity_requirement = Column(String, default="Medium to High (50-60%)")
    humidity_target_pct = Column(Integer, nullable=True, default=50)
    temp_min_f = Column(Integer, nullable=True, default=65)
    temp_max_f = Column(Integer, nullable=True, default=80)
    recommended_watering_days = Column(Integer, default=7)
    default_watering_interval_days = Column(Integer, default=7)
    default_fertilization_interval_days = Column(Integer, default=30)
    description = Column(Text, nullable=True)
    is_custom = Column(Boolean, default=False)
    created_by_user_id = Column(
        String, ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    created_at = Column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    creator = relationship("User", back_populates="custom_species")
    plants = relationship("UserPlant", back_populates="species")


class UserPlant(Base):
    __tablename__ = "user_plants"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(
        String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    species_id = Column(
        String, ForeignKey("species.id", ondelete="SET NULL"), nullable=True, index=True
    )
    nickname = Column(String, nullable=False)
    location = Column(String, default="Living Room")
    photo_url = Column(String, nullable=True)
    status = Column(String, default="Active")  # Active, Archived, Repotted, Sick
    watering_interval_days = Column(Integer, default=7)
    fertilization_interval_days = Column(Integer, default=30)
    last_watered_at = Column(DateTime(timezone=True), nullable=True)
    next_water_due = Column(DateTime(timezone=True), nullable=True, index=True)
    last_fertilized_at = Column(DateTime(timezone=True), nullable=True)
    next_fertilize_due = Column(DateTime(timezone=True), nullable=True, index=True)
    notifications_enabled = Column(Boolean, default=True)
    snoozed_until = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    user = relationship("User", back_populates="plants")
    species = relationship("Species", back_populates="plants")
    health_logs = relationship(
        "PlantHealthLog", back_populates="plant", cascade="all, delete-orphan"
    )
    care_logs = relationship(
        "CareLog", back_populates="plant", cascade="all, delete-orphan"
    )


class PlantHealthLog(Base):
    __tablename__ = "plant_health_logs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    plant_id = Column(
        String,
        ForeignKey("user_plants.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    user_id = Column(
        String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    rating = Column(String, nullable=False)  # Excellent, Good, Fair, Poor
    notes = Column(Text, nullable=True)
    repotted_flag = Column(Boolean, default=False)
    photo_url = Column(String, nullable=True)
    logged_at = Column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    created_at = Column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    plant = relationship("UserPlant", back_populates="health_logs")
    user = relationship("User", back_populates="health_logs")


class CareLog(Base):
    __tablename__ = "care_logs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    plant_id = Column(
        String,
        ForeignKey("user_plants.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    care_type = Column(String, nullable=False)  # WATERING, FERTILIZATION
    performed_at = Column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    notes = Column(Text, nullable=True)
    created_at = Column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    plant = relationship("UserPlant", back_populates="care_logs")
