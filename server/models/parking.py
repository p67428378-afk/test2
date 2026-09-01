import uuid
from datetime import datetime
from sqlalchemy import (
    Column,
    String,
    Float,
    Integer,
    Boolean,
    DateTime,
    ForeignKey,
    Time,
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class ParkingLocation(Base):
    __tablename__ = "parking_locations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    address = Column(String(500), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    spot_type = Column(
        String(50), nullable=False, default="garage"
    )  # covered, open_lot, street, garage
    has_ev_charging = Column(Boolean, default=False, nullable=False)
    total_capacity = Column(Integer, nullable=False, default=50)
    available_spots = Column(Integer, nullable=False, default=10)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    # Relationships
    spots = relationship(
        "ParkingSpot", back_populates="location", cascade="all, delete-orphan"
    )
    rates = relationship(
        "HourlyRate",
        back_populates="location",
        uselist=False,
        cascade="all, delete-orphan",
    )


class ParkingSpot(Base):
    __tablename__ = "parking_spots"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    location_id = Column(
        String(36),
        ForeignKey("parking_locations.id", ondelete="CASCADE"),
        nullable=False,
    )
    spot_number = Column(String(50), nullable=False)
    status = Column(
        String(20), nullable=False, default="AVAILABLE"
    )  # AVAILABLE, OCCUPIED, RESERVED
    last_status_change = Column(DateTime, default=datetime.utcnow, nullable=False)

    location = relationship("ParkingLocation", back_populates="spots")


class HourlyRate(Base):
    __tablename__ = "hourly_rates"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    location_id = Column(
        String(36),
        ForeignKey("parking_locations.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )
    base_rate_per_hour = Column(Float, nullable=False, default=5.0)
    peak_rate_per_hour = Column(Float, nullable=False, default=8.0)
    peak_start_time = Column(Time, nullable=True)  # e.g., 07:00:00
    peak_end_time = Column(Time, nullable=True)  # e.g., 19:00:00
    max_daily_rate = Column(Float, nullable=True, default=35.0)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    location = relationship("ParkingLocation", back_populates="rates")


class SensorEvent(Base):
    __tablename__ = "sensor_events"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    spot_id = Column(String(36), nullable=False)
    location_id = Column(String(36), nullable=True)
    facility_name = Column(String(255), nullable=True)
    status = Column(String(20), nullable=False)
    available_spots = Column(Integer, nullable=True)
    event_type = Column(String(50), default="SPOT_STATUS_CHANGED", nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
