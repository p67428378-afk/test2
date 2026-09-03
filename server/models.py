"""SQLAlchemy models for Aura Photography Studio Management System."""

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
from sqlalchemy.orm import DeclarativeBase, relationship


class Base(DeclarativeBase):
    pass


def generate_uuid() -> str:
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(
        String(50), default="Customer", nullable=False
    )  # Customer, Photographer, Admin
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    photographer = relationship(
        "Photographer",
        uselist=False,
        back_populates="user",
        cascade="all, delete-orphan",
    )
    sessions = relationship("Session", back_populates="customer")


class Photographer(Base):
    __tablename__ = "photographers"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )
    bio = Column(Text, nullable=True)
    specialization = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    user = relationship("User", back_populates="photographer")
    availabilities = relationship(
        "Availability", back_populates="photographer", cascade="all, delete-orphan"
    )
    sessions = relationship("Session", back_populates="photographer")


class Availability(Base):
    __tablename__ = "availability"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    photographer_id = Column(
        String(36), ForeignKey("photographers.id", ondelete="CASCADE"), nullable=False
    )
    day_of_week = Column(Integer, nullable=True)  # 0=Monday..6=Sunday
    start_time = Column(String(20), nullable=True)  # e.g. "09:00"
    end_time = Column(String(20), nullable=True)  # e.g. "17:00"
    blocked_date = Column(String(20), nullable=True)  # YYYY-MM-DD
    block_reason = Column(String(255), nullable=True)
    is_blocked = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    photographer = relationship("Photographer", back_populates="availabilities")


class Package(Base):
    __tablename__ = "packages"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    duration_minutes = Column(Integer, nullable=False, default=60)
    deliverables_summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    sessions = relationship("Session", back_populates="package")


class AddOn(Base):
    __tablename__ = "addons"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )


class SessionAddOn(Base):
    __tablename__ = "session_addons"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    session_id = Column(
        String(36), ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False
    )
    addon_id = Column(
        String(36), ForeignKey("addons.id", ondelete="CASCADE"), nullable=False
    )
    price_at_booking = Column(Float, nullable=False)

    addon = relationship("AddOn")
    session = relationship("Session", back_populates="session_addons")


class Session(Base):
    __tablename__ = "sessions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    customer_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    photographer_id = Column(String(36), ForeignKey("photographers.id"), nullable=False)
    package_id = Column(String(36), ForeignKey("packages.id"), nullable=False)
    start_time = Column(DateTime, nullable=False, index=True)
    end_time = Column(DateTime, nullable=True)
    event_notes = Column(Text, nullable=True)
    total_price = Column(Float, nullable=False)
    deposit_amount = Column(Float, nullable=False)
    status = Column(String(50), default="Pending Payment", nullable=False)
    hold_expires_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    customer = relationship("User", back_populates="sessions")
    photographer = relationship("Photographer", back_populates="sessions")
    package = relationship("Package", back_populates="sessions")
    session_addons = relationship(
        "SessionAddOn", back_populates="session", cascade="all, delete-orphan"
    )
    payments = relationship(
        "Payment", back_populates="session", cascade="all, delete-orphan"
    )
    photoshoot_record = relationship(
        "PhotoshootRecord",
        uselist=False,
        back_populates="session",
        cascade="all, delete-orphan",
    )


class Payment(Base):
    __tablename__ = "payments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    session_id = Column(
        String(36), ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False
    )
    amount = Column(Float, nullable=False)
    payment_method = Column(String(50), default="credit_card", nullable=False)
    payment_status = Column(
        String(50), default="Pending", nullable=False
    )  # Pending, Partial, Paid, Refunded
    transaction_reference = Column(String(255), unique=True, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    session = relationship("Session", back_populates="payments")


class PhotoshootRecord(Base):
    __tablename__ = "photoshoot_records"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    session_id = Column(
        String(36),
        ForeignKey("sessions.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )
    gallery_url = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    is_completed = Column(Boolean, default=False, nullable=False)
    unpaid_balance_warning = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    session = relationship("Session", back_populates="photoshoot_record")


class ExtendedFeature(Base):
    __tablename__ = "extended_features"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    feature_name = Column(String(100), nullable=False)
    configuration = Column(Text, default="{}", nullable=False)
    status = Column(String(50), default="Active", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )
