"""
Module: server.models.menu
Purpose: MenuItem model definition.
"""

import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Numeric, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from server.database import Base


class MenuItem(Base):
    __tablename__ = "menu_items"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    restaurant_id = Column(String(36), ForeignKey("restaurants.id"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Numeric(10, 2), nullable=False)
    image_url = Column(String(512), nullable=True)
    is_available = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    restaurant = relationship("Restaurant", back_populates="menu_items")
    order_items = relationship("OrderItem", back_populates="menu_item")
