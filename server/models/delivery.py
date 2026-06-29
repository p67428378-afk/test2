"""
Module: server.models.delivery
Purpose: Delivery model definition.
"""

import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from server.database import Base


class Delivery(Base):
    __tablename__ = "deliveries"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id = Column(String(36), ForeignKey("orders.id"), unique=True, nullable=False)
    driver_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    status = Column(
        String(50), default="assigned", nullable=False
    )  # assigned, accepted, out_for_delivery, delivered
    current_latitude = Column(Numeric(10, 8), nullable=True)
    current_longitude = Column(Numeric(11, 8), nullable=True)
    earnings = Column(Numeric(10, 2), default=0.0, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    order = relationship("Order", back_populates="delivery")
    driver = relationship("User", back_populates="deliveries")
