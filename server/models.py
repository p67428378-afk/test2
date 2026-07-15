import uuid
from sqlalchemy import Column, String, DateTime, Numeric, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from server.database import Base


class User(Base):
    __tablename__ = "users"
    user_id = Column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True
    )
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    orders = relationship("Order", back_populates="user")


class Product(Base):
    __tablename__ = "products"
    product_id = Column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True
    )
    name = Column(String(255), nullable=False)
    description = Column(String, nullable=True)
    price = Column(Numeric(10, 2), default=0.00, nullable=False)
    image_urls = Column(
        String, default="[]", nullable=False
    )  # Stored as JSON string for SQLite compatibility
    category = Column(String(100), nullable=False)
    rating = Column(Numeric(3, 2), default=5.00, nullable=False)
    review_count = Column(Integer, default=0, nullable=False)
    tags = Column(
        String, default="[]", nullable=False
    )  # Stored as JSON string for SQLite compatibility
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    order_items = relationship("OrderItem", back_populates="product")


class Order(Base):
    __tablename__ = "orders"
    order_id = Column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True
    )
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=False)
    total_amount = Column(Numeric(10, 2), default=0.00, nullable=False)
    status = Column(String(50), default="pending", nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    user = relationship("User", back_populates="orders")
    items = relationship(
        "OrderItem", back_populates="order", cascade="all, delete-orphan"
    )


class OrderItem(Base):
    __tablename__ = "order_items"
    order_item_id = Column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True
    )
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.order_id"), nullable=False)
    product_id = Column(
        UUID(as_uuid=True), ForeignKey("products.product_id"), nullable=False
    )
    quantity = Column(Integer, default=1, nullable=False)
    price = Column(Numeric(10, 2), default=0.00, nullable=False)

    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")


class CartItem(Base):
    __tablename__ = "cart_items"
    cart_item_id = Column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True
    )
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=False)
    product_id = Column(
        UUID(as_uuid=True), ForeignKey("products.product_id"), nullable=False
    )
    quantity = Column(Integer, default=1, nullable=False)

    product = relationship("Product")
