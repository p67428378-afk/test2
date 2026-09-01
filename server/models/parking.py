import uuid
from datetime import datetime, timezone
from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import relationship
from server.database import Base


class ParkingLocation(Base):
    __tablename__ = "parking_locations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    address = Column(Text, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    spot_type = Column(String(50), nullable=False, default="garage")  # covered, open_lot, street, garage
    has_ev_charging = Column(Boolean, default=False, nullable=False)
    total_capacity = Column(Integer, nullable=False, default=10)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    spots = relationship("ParkingSpot", back_populates="location", cascade="all, delete-orphan", lazy="selectin")
    rates = relationship("HourlyRate", back_populates="location", uselist=False, cascade="all, delete-orphan", lazy="selectin")


class ParkingSpot(Base):
    __tablename__ = "parking_spots"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    location_id = Column(String(36), ForeignKey("parking_locations.id", ondelete="CASCADE"), nullable=False)
    spot_number = Column(String(50), nullable=False)
    status = Column(String(20), nullable=False, default="AVAILABLE")  # AVAILABLE, OCCUPIED, RESERVED
    last_status_change = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    location = relationship("ParkingLocation", back_populates="spots")


class HourlyRate(Base):
    __tablename__ = "hourly_rates"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    location_id = Column(String(36), ForeignKey("parking_locations.id", ondelete="CASCADE"), nullable=False, unique=True)
    base_rate_per_hour = Column(Numeric(10, 2), nullable=False, default=5.00)
    peak_rate_per_hour = Column(Numeric(10, 2), nullable=False, default=8.00)
    weekend_rate_per_hour = Column(Numeric(10, 2), nullable=True, default=6.00)
    peak_start_time = Column(String(8), nullable=True, default="07:00:00")
    peak_end_time = Column(String(8), nullable=True, default="19:00:00")
    max_daily_rate = Column(Numeric(10, 2), nullable=True, default=35.00)
    currency = Column(String(10), nullable=False, default="USD")
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    location = relationship("ParkingLocation", back_populates="rates")
