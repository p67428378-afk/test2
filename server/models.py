import uuid
from datetime import datetime
from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import relationship

from server.database import Base


class Chocolate(Base):
    __tablename__ = "chocolates"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    cocoa_percentage = Column(Integer, nullable=False)
    origin_region = Column(String(100), nullable=False)
    flavor_notes = Column(String(255), nullable=False)
    dietary_flags = Column(String(255), nullable=False)
    price = Column(Float, nullable=False)
    stock_quantity = Column(Integer, nullable=False, default=0)
    is_heat_sensitive = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )


class Cart(Base):
    __tablename__ = "carts"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_token = Column(
        String(255), unique=True, nullable=False, default=lambda: str(uuid.uuid4())
    )
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    items = relationship(
        "CartItem", back_populates="cart", cascade="all, delete-orphan", lazy="joined"
    )


class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    cart_id = Column(String(36), ForeignKey("carts.id"), nullable=False)
    chocolate_id = Column(String(36), ForeignKey("chocolates.id"), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    cart = relationship("Cart", back_populates="items")
    chocolate = relationship("Chocolate", lazy="joined")


class Order(Base):
    __tablename__ = "orders"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    order_code = Column(String(32), unique=True, nullable=False)
    customer_name = Column(String(255), nullable=False)
    customer_email = Column(String(255), nullable=False)
    shipping_address = Column(Text, nullable=False)
    shipping_method = Column(String(50), nullable=False, default="standard_ground")
    shipping_fee = Column(Float, nullable=False, default=0.0)
    subtotal_amount = Column(Float, nullable=False)
    total_amount = Column(Float, nullable=False)
    order_status = Column(String(50), nullable=False, default="Processing")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    items = relationship(
        "OrderItem", back_populates="order", cascade="all, delete-orphan", lazy="joined"
    )


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id = Column(String(36), ForeignKey("orders.id"), nullable=False)
    chocolate_id = Column(String(36), ForeignKey("chocolates.id"), nullable=False)
    unit_price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    order = relationship("Order", back_populates="items")
    chocolate = relationship("Chocolate", lazy="joined")
