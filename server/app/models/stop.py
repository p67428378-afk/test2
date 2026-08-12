"""
Module: models.stop
Purpose: Bus stop and route-stop mapping models
"""

import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from server.app.database import Base


class Stop(Base):
    __tablename__ = "stops"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), index=True, nullable=False)
    address = Column(String(255), nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    route_stops = relationship(
        "RouteStop", back_populates="stop", cascade="all, delete-orphan"
    )
    alerts = relationship("Alert", back_populates="stop")


class RouteStop(Base):
    __tablename__ = "route_stops"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    route_id = Column(
        String(36), ForeignKey("routes.id", ondelete="CASCADE"), nullable=False
    )
    stop_id = Column(
        String(36), ForeignKey("stops.id", ondelete="CASCADE"), nullable=False
    )
    sequence_order = Column(Integer, default=0, nullable=False)

    route = relationship("Route", back_populates="route_stops")
    stop = relationship("Stop", back_populates="route_stops")
