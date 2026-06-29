"""
Module: server.models.restaurant
Purpose: Restaurant model definition.
"""

import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Numeric, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from server.database import Base


class Restaurant(Base):
    __tablename__ = "restaurants"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    owner_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    name = Column(String(255), nullable=False)
    cuisine = Column(String(100), nullable=False)
    rating = Column(Numeric(3, 2), default=0.0, nullable=False)
    delivery_time = Column(Integer, default=30, nullable=False)
    delivery_fee = Column(Numeric(10, 2), default=0.0, nullable=False)
    operating_hours = Column(String(100), nullable=True)
    address = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    owner = relationship("User", back_populates="restaurants")
    menu_items = relationship(
        "MenuItem", back_populates="restaurant", cascade="all, delete-orphan"
    )
    orders = relationship(
        "Order", back_populates="restaurant", cascade="all, delete-orphan"
    )
