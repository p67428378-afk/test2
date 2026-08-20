"""
Module: server.models
Purpose: SQLAlchemy models for the Warranty Tracker application.
"""

import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Integer,
    Boolean,
    Date,
    Float,
    ForeignKey,
    DateTime,
)
from sqlalchemy.orm import relationship
from server.database import Base


def generate_uuid():
    return str(uuid.uuid4())


def get_utc_now():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    role = Column(String, default="user")
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=True)
    created_at = Column(DateTime, default=get_utc_now)

    products = relationship(
        "Product", back_populates="user", cascade="all, delete-orphan"
    )
    notifications = relationship(
        "Notification", back_populates="user", cascade="all, delete-orphan"
    )


class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    serial_number = Column(String, nullable=False)
    manufacturer = Column(String, nullable=False)
    category = Column(String, nullable=False)
    purchase_date = Column(Date, nullable=False)
    created_at = Column(DateTime, default=get_utc_now)

    user = relationship("User", back_populates="products")
    warranty = relationship(
        "Warranty",
        back_populates="product",
        uselist=False,
        cascade="all, delete-orphan",
    )
    claims = relationship(
        "Claim", back_populates="product", cascade="all, delete-orphan"
    )
    receipts = relationship(
        "Receipt", back_populates="product", cascade="all, delete-orphan"
    )
    notifications = relationship(
        "Notification", back_populates="product", cascade="all, delete-orphan"
    )


class Warranty(Base):
    __tablename__ = "warranties"

    id = Column(String, primary_key=True, default=generate_uuid)
    product_id = Column(
        String,
        ForeignKey("products.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )
    duration_months = Column(Integer, nullable=True)
    is_lifetime = Column(Boolean, default=False)
    expiry_date = Column(Date, nullable=True)
    status = Column(String, default="Active")  # Active, Expiring Soon, Expired
    created_at = Column(DateTime, default=get_utc_now)

    product = relationship("Product", back_populates="warranty")


class Claim(Base):
    __tablename__ = "claims"

    id = Column(String, primary_key=True, default=generate_uuid)
    product_id = Column(
        String, ForeignKey("products.id", ondelete="CASCADE"), nullable=False
    )
    claim_date = Column(Date, nullable=False)
    issue_description = Column(String, nullable=False)
    status = Column(String, default="Pending")  # Pending, Approved, Rejected, Completed
    resolution_notes = Column(String, nullable=True)
    service_cost = Column(Float, default=0.0)
    created_at = Column(DateTime, default=get_utc_now)

    product = relationship("Product", back_populates="claims")


class Receipt(Base):
    __tablename__ = "receipts"

    id = Column(String, primary_key=True, default=generate_uuid)
    product_id = Column(
        String, ForeignKey("products.id", ondelete="CASCADE"), nullable=True
    )
    filename = Column(String, nullable=False)
    file_url = Column(String, nullable=False)
    created_at = Column(DateTime, default=get_utc_now)

    product = relationship("Product", back_populates="receipts")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(
        String, ForeignKey("products.id", ondelete="CASCADE"), nullable=False
    )
    milestone = Column(String, nullable=False)  # 30-day, 14-day, 1-day
    sent_at = Column(DateTime, default=get_utc_now)
    created_at = Column(DateTime, default=get_utc_now)

    user = relationship("User", back_populates="notifications")
    product = relationship("Product", back_populates="notifications")
