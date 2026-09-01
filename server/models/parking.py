import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Float,
    Integer,
    Boolean,
    DateTime,
    ForeignKey,
    Text,
)
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()


def generate_uuid() -> str:
    return str(uuid.uuid4())


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="user", nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)


class ParkingLocation(Base):
    __tablename__ = "parking_locations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False, index=True)
    address = Column(Text, nullable=False)
    latitude = Column(Float, nullable=False, index=True)
    longitude = Column(Float, nullable=False, index=True)
    spot_type = Column(
        String(50), nullable=False, default="garage"
    )  # covered, open_lot, street, garage
    has_ev_charging = Column(Boolean, default=False, nullable=False)
    total_capacity = Column(Integer, nullable=False, default=50)
    available_spots = Column(Integer, nullable=False, default=10)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    spots = relationship(
        "ParkingSpot", back_populates="location", cascade="all, delete-orphan"
    )
    rates = relationship(
        "HourlyRate",
        back_populates="location",
        cascade="all, delete-orphan",
        uselist=False,
    )


class ParkingSpot(Base):
    __tablename__ = "parking_spots"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    location_id = Column(
        String(36),
        ForeignKey("parking_locations.id", ondelete="CASCADE"),
        nullable=False,
    )
    spot_number = Column(String(50), nullable=False)
    status = Column(
        String(20), nullable=False, default="AVAILABLE"
    )  # AVAILABLE, OCCUPIED, RESERVED
    last_status_change = Column(
        DateTime, default=utc_now, onupdate=utc_now, nullable=False
    )

    location = relationship("ParkingLocation", back_populates="spots")


class HourlyRate(Base):
    __tablename__ = "hourly_rates"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    location_id = Column(
        String(36),
        ForeignKey("parking_locations.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )
    base_rate_per_hour = Column(Float, nullable=False, default=5.0)
    peak_rate_per_hour = Column(Float, nullable=False, default=8.0)
    peak_start_time = Column(String(20), nullable=False, default="07:00:00")
    peak_end_time = Column(String(20), nullable=False, default="19:00:00")
    max_daily_rate = Column(Float, nullable=False, default=35.0)
    weekend_rate_per_hour = Column(Float, nullable=False, default=6.0)

    location = relationship("ParkingLocation", back_populates="rates")
