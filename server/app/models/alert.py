"""
Module: models.alert
Purpose: Proximity and arrival alert notification subscriptions
"""

import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from server.app.database import Base


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=True
    )
    bus_id = Column(
        String(36), ForeignKey("buses.id", ondelete="CASCADE"), nullable=True
    )
    stop_id = Column(
        String(36), ForeignKey("stops.id", ondelete="CASCADE"), nullable=False
    )
    threshold_minutes = Column(Integer, default=5, nullable=False)
    threshold_distance_miles = Column(Float, default=1.0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="alerts")
    bus = relationship("Bus", back_populates="alerts")
    stop = relationship("Stop", back_populates="alerts")
