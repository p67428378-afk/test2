import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from server.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, index=True, nullable=True)
    full_name = Column(String(255), nullable=True)
    role = Column(String(50), default="member", nullable=False)
    hashed_password = Column(String(255), nullable=False)

    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=True, nullable=False)

    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )


class Route(Base):
    __tablename__ = "routes"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    code = Column(String(50), unique=True, index=True, nullable=False)
    color_code = Column(String(50), default="#0D9488", nullable=False)

    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    trains = relationship("Train", back_populates="route")


class Station(Base):
    __tablename__ = "stations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), index=True, nullable=False)
    code = Column(String(50), unique=True, index=True, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)

    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    schedules = relationship("Schedule", back_populates="station")


class Train(Base):
    __tablename__ = "trains"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    train_number = Column(String(50), unique=True, index=True, nullable=False)
    route_id = Column(String(36), ForeignKey("routes.id"), nullable=True)
    status = Column(
        String(50), default="active", nullable=False
    )  # active, maintenance, signal_lost

    latitude = Column(Float, default=0.0, nullable=False)
    longitude = Column(Float, default=0.0, nullable=False)
    speed = Column(Float, default=0.0, nullable=False)
    heading = Column(Float, default=0.0, nullable=False)
    last_telemetry_at = Column(DateTime, nullable=True)

    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    route = relationship("Route", back_populates="trains")
    schedules = relationship("Schedule", back_populates="train")
    location_logs = relationship("LocationLog", back_populates="train")
    delay_alerts = relationship("DelayAlert", back_populates="train")


class Schedule(Base):
    __tablename__ = "schedules"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    train_id = Column(String(36), ForeignKey("trains.id"), nullable=False)
    station_id = Column(String(36), ForeignKey("stations.id"), nullable=False)
    scheduled_arrival = Column(DateTime, nullable=False)
    scheduled_departure = Column(DateTime, nullable=False)

    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    train = relationship("Train", back_populates="schedules")
    station = relationship("Station", back_populates="schedules")


class LocationLog(Base):
    __tablename__ = "location_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    train_id = Column(String(36), ForeignKey("trains.id"), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    speed = Column(Float, default=0.0, nullable=False)
    heading = Column(Float, default=0.0, nullable=False)
    recorded_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), index=True, nullable=False
    )

    train = relationship("Train", back_populates="location_logs")


class DelayAlert(Base):
    __tablename__ = "delay_alerts"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    train_id = Column(String(36), ForeignKey("trains.id"), nullable=False)
    delay_minutes = Column(Integer, nullable=False)
    reason = Column(String(255), nullable=True)
    is_resolved = Column(Boolean, default=False, nullable=False)

    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    train = relationship("Train", back_populates="delay_alerts")
