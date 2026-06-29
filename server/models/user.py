"""
Module: server.models.user
Purpose: User model definition.
"""

import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, Boolean
from sqlalchemy.orm import relationship
from server.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)  # customer, restaurant, delivery, admin
    phone = Column(String(50), nullable=True)
    is_online = Column(Boolean, default=True, nullable=False)  # For delivery partners
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    restaurants = relationship(
        "Restaurant", back_populates="owner", cascade="all, delete-orphan"
    )
    orders = relationship("Order", back_populates="user", cascade="all, delete-orphan")
    deliveries = relationship("Delivery", back_populates="driver")
    tickets = relationship(
        "SupportTicket", back_populates="user", cascade="all, delete-orphan"
    )
