"""
Module: server.models.order
Purpose: Order, OrderItem, and Payment model definitions.
"""

import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Numeric, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from server.database import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    restaurant_id = Column(String(36), ForeignKey("restaurants.id"), nullable=False)
    status = Column(
        String(50), default="pending", nullable=False
    )  # pending, accepted, preparing, ready_for_pickup, out_for_delivery, delivered, cancelled
    total_amount = Column(Numeric(10, 2), nullable=False)
    delivery_address = Column(Text, nullable=False)
    payment_status = Column(
        String(50), default="pending", nullable=False
    )  # pending, paid, failed
    rating = Column(Numeric(3, 2), nullable=True)  # Customer rating for the order
    feedback = Column(Text, nullable=True)  # Customer feedback for the order
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    user = relationship("User", back_populates="orders")
    restaurant = relationship("Restaurant", back_populates="orders")
    items = relationship(
        "OrderItem", back_populates="order", cascade="all, delete-orphan"
    )
    delivery = relationship(
        "Delivery", back_populates="order", uselist=False, cascade="all, delete-orphan"
    )
    payments = relationship(
        "Payment", back_populates="order", cascade="all, delete-orphan"
    )


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id = Column(String(36), ForeignKey("orders.id"), nullable=False)
    menu_item_id = Column(String(36), ForeignKey("menu_items.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    price = Column(Numeric(10, 2), nullable=False)

    # Relationships
    order = relationship("Order", back_populates="items")
    menu_item = relationship("MenuItem", back_populates="order_items")

    @property
    def name(self) -> str:
        """
        Get the name of the menu item.
        """
        return self.menu_item.name if self.menu_item else ""


class Payment(Base):
    __tablename__ = "payments"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id = Column(String(36), ForeignKey("orders.id"), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    payment_method = Column(String(50), nullable=False)
    status = Column(String(50), default="completed", nullable=False)
    transaction_id = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    order = relationship("Order", back_populates="payments")
