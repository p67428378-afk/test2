"""
Module: models
Purpose: SQLAlchemy database models.
"""

import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from server.app.database import Base


def generate_uuid():
    return str(uuid.uuid4())


def get_utc_now():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=False)
    role = Column(String, default="customer", nullable=False)
    created_at = Column(DateTime, default=get_utc_now, nullable=False)
    updated_at = Column(
        DateTime, default=get_utc_now, onupdate=get_utc_now, nullable=False
    )

    # Relationships
    wishlist_items = relationship(
        "Wishlist", back_populates="user", cascade="all, delete-orphan"
    )
    cart_items = relationship(
        "Cart", back_populates="user", cascade="all, delete-orphan"
    )
    orders = relationship("Order", back_populates="user", cascade="all, delete-orphan")
    reviews = relationship(
        "Review", back_populates="user", cascade="all, delete-orphan"
    )


class Category(Base):
    __tablename__ = "categories"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    parent_id = Column(String, ForeignKey("categories.id"), nullable=True)

    # Relationships
    parent = relationship("Category", remote_side=[id], back_populates="subcategories")
    subcategories = relationship(
        "Category", back_populates="parent", cascade="all, delete-orphan"
    )
    products = relationship("Product", back_populates="category")


class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=False)
    price = Column(Float, nullable=False)
    image_url = Column(String, nullable=False)
    stock = Column(Integer, default=0, nullable=False)
    category_id = Column(String, ForeignKey("categories.id"), nullable=False)
    brand = Column(String, nullable=False, index=True)
    size = Column(String, nullable=False, index=True)
    color = Column(String, nullable=False, index=True)
    rating = Column(Float, nullable=True)
    created_at = Column(DateTime, default=get_utc_now, nullable=False)
    updated_at = Column(
        DateTime, default=get_utc_now, onupdate=get_utc_now, nullable=False
    )

    # Relationships
    category = relationship("Category", back_populates="products")
    wishlist_entries = relationship(
        "Wishlist", back_populates="product", cascade="all, delete-orphan"
    )
    cart_entries = relationship(
        "Cart", back_populates="product", cascade="all, delete-orphan"
    )
    order_items = relationship(
        "OrderItem", back_populates="product", cascade="all, delete-orphan"
    )
    reviews = relationship(
        "Review", back_populates="product", cascade="all, delete-orphan"
    )


class Wishlist(Base):
    __tablename__ = "wishlist"

    user_id = Column(String, ForeignKey("users.id"), primary_key=True)
    product_id = Column(String, ForeignKey("products.id"), primary_key=True)

    # Relationships
    user = relationship("User", back_populates="wishlist_items")
    product = relationship("Product", back_populates="wishlist_entries")


class Cart(Base):
    __tablename__ = "cart"

    user_id = Column(String, ForeignKey("users.id"), primary_key=True)
    product_id = Column(String, ForeignKey("products.id"), primary_key=True)
    quantity = Column(Integer, default=1, nullable=False)

    # Relationships
    user = relationship("User", back_populates="cart_items")
    product = relationship("Product", back_populates="cart_entries")


class Order(Base):
    __tablename__ = "orders"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    status = Column(String, default="pending", nullable=False)
    total_price = Column(Float, nullable=False)
    shipping_address = Column(String, nullable=False)
    payment_method = Column(String, nullable=False)
    created_at = Column(DateTime, default=get_utc_now, nullable=False)
    updated_at = Column(
        DateTime, default=get_utc_now, onupdate=get_utc_now, nullable=False
    )

    # Relationships
    user = relationship("User", back_populates="orders")
    items = relationship(
        "OrderItem", back_populates="order", cascade="all, delete-orphan"
    )


class OrderItem(Base):
    __tablename__ = "order_items"

    order_id = Column(String, ForeignKey("orders.id"), primary_key=True)
    product_id = Column(String, ForeignKey("products.id"), primary_key=True)
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)

    # Relationships
    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")


class Review(Base):
    __tablename__ = "reviews"

    id = Column(String, primary_key=True, default=generate_uuid)
    product_id = Column(String, ForeignKey("products.id"), nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    rating = Column(Integer, nullable=False)
    comment = Column(Text, nullable=False)
    created_at = Column(DateTime, default=get_utc_now, nullable=False)

    # Relationships
    product = relationship("Product", back_populates="reviews")
    user = relationship("User", back_populates="reviews")
