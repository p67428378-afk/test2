import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from server.database import Base


class ParkingLocation(Base):
    __tablename__ = "parking_locations"

    id = Column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        index=True,
    )
    name = Column(String(255), nullable=False, index=True)
    address = Column(String(500), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    spot_type = Column(String(50), nullable=False, default="garage")
    category = Column(String(100), nullable=False, default="Car", index=True)
    has_ev_charging = Column(Boolean, default=False)
    total_capacity = Column(Integer, default=50)
    available_spots = Column(Integer, default=10)
    status = Column(String(50), default="available")
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    rates = relationship(
        "HourlyRate", back_populates="location", cascade="all, delete-orphan"
    )
    spots = relationship(
        "ParkingSpot", back_populates="location", cascade="all, delete-orphan"
    )


class HourlyRate(Base):
    __tablename__ = "hourly_rates"

    id = Column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        index=True,
    )
    location_id = Column(
        String(36), ForeignKey("parking_locations.id", ondelete="CASCADE"), nullable=False
    )
    base_rate_per_hour = Column(Float, nullable=False, default=5.00)
    peak_rate_per_hour = Column(Float, nullable=False, default=8.00)
    off_peak_rate_per_hour = Column(Float, nullable=False, default=3.50)
    weekend_rate_per_hour = Column(Float, nullable=False, default=4.00)
    max_daily_rate = Column(Float, nullable=False, default=35.00)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    location = relationship("ParkingLocation", back_populates="rates")


class ParkingSpot(Base):
    __tablename__ = "parking_spots"

    id = Column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        index=True,
    )
    location_id = Column(
        String(36), ForeignKey("parking_locations.id", ondelete="CASCADE"), nullable=False
    )
    spot_number = Column(String(50), nullable=False)
    status = Column(String(50), default="available")  # available, occupied, reserved
    category = Column(String(100), default="Car")
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    location = relationship("ParkingLocation", back_populates="spots")


class StatusEvent(Base):
    __tablename__ = "status_events"

    id = Column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        index=True,
    )
    location_id = Column(String(36), nullable=False, index=True)
    spot_id = Column(String(36), nullable=True)
    event = Column(String(100), nullable=False)
    status = Column(String(50), nullable=False)
    available_spots = Column(Integer, nullable=False)
    timestamp = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
