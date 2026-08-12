"""
Module: models.bus
Purpose: Bus vehicle fleet and telemetry log models
"""

import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from server.app.database import Base


class Bus(Base):
    __tablename__ = "buses"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    bus_number = Column(String(50), unique=True, index=True, nullable=False)
    route_id = Column(
        String(36), ForeignKey("routes.id", ondelete="SET NULL"), nullable=True
    )
    driver_id = Column(
        String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    latitude = Column(Float, default=0.0, nullable=False)
    longitude = Column(Float, default=0.0, nullable=False)
    speed_mph = Column(Float, default=0.0, nullable=False)
    status = Column(String(50), default="active", nullable=False)
    last_telemetry_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    route = relationship("Route", back_populates="buses")
    driver = relationship("User", back_populates="buses_driven")
    telemetry_logs = relationship(
        "TelemetryLog", back_populates="bus", cascade="all, delete-orphan"
    )
    alerts = relationship("Alert", back_populates="bus")


class TelemetryLog(Base):
    __tablename__ = "telemetry_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    bus_id = Column(
        String(36), ForeignKey("buses.id", ondelete="CASCADE"), nullable=False
    )
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    speed_mph = Column(Float, default=0.0, nullable=False)
    timestamp = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )

    bus = relationship("Bus", back_populates="telemetry_logs")
