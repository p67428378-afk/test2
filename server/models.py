import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Text,
    Integer,
    Float,
    Boolean,
    DateTime,
    Date,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from server.database import Base


def generate_uuid():
    return str(uuid.uuid4())


def utc_now():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(
        String(50), nullable=False, default="customer"
    )  # customer, photographer, admin
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    photographer_profile = relationship(
        "Photographer",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )
    sessions = relationship(
        "Session", back_populates="customer", foreign_keys="Session.customer_id"
    )


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
    specialties = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    user = relationship("User", back_populates="photographer_profile")
    availabilities = relationship(
        "Availability", back_populates="photographer", cascade="all, delete-orphan"
    )
    sessions = relationship(
        "Session", back_populates="photographer", foreign_keys="Session.photographer_id"
    )


class Availability(Base):
    __tablename__ = "availability"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    photographer_id = Column(
        String(36), ForeignKey("photographers.id", ondelete="CASCADE"), nullable=False
    )
    date = Column(Date, nullable=True)  # Specific date block/override
    day_of_week = Column(Integer, nullable=True)  # 0=Mon, 6=Sun for recurring hours
    start_time = Column(String(10), nullable=False)  # HH:MM e.g. "09:00"
    end_time = Column(String(10), nullable=False)  # HH:MM e.g. "17:00"
    is_blocked = Column(Boolean, default=False, nullable=False)
    reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    photographer = relationship("Photographer", back_populates="availabilities")


class Package(Base):
    __tablename__ = "packages"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False, unique=True)
    description = Column(Text, nullable=True)
    duration_minutes = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)
    deliverables_summary = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    sessions = relationship("Session", back_populates="package")


class Session(Base):
    __tablename__ = "sessions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    customer_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    photographer_id = Column(String(36), ForeignKey("photographers.id"), nullable=False)
    package_id = Column(String(36), ForeignKey("packages.id"), nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    status = Column(
        String(50), default="pending_payment", nullable=False
    )  # pending_payment, confirmed, in_progress, completed, cancelled
    total_price = Column(Float, nullable=False)
    deposit_amount = Column(Float, nullable=False)
    hold_expires_at = Column(DateTime, nullable=True)
    event_notes = Column(Text, nullable=True)
    add_ons = Column(Text, nullable=True)  # JSON or comma-separated add-on descriptions
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    customer = relationship(
        "User", back_populates="sessions", foreign_keys=[customer_id]
    )
    photographer = relationship(
        "Photographer", back_populates="sessions", foreign_keys=[photographer_id]
    )
    package = relationship("Package", back_populates="sessions")
    payments = relationship(
        "Payment", back_populates="session", cascade="all, delete-orphan"
    )
    photoshoot_record = relationship(
        "PhotoshootRecord",
        back_populates="session",
        uselist=False,
        cascade="all, delete-orphan",
    )


class Payment(Base):
    __tablename__ = "payments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    session_id = Column(
        String(36), ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False
    )
    amount = Column(Float, nullable=False)
    payment_status = Column(
        String(50), nullable=False
    )  # pending, partial, paid, refunded
    payment_method = Column(
        String(50), nullable=False
    )  # credit_card, bank_transfer, cash
    transaction_reference = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

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
    gallery_url = Column(String(500), nullable=True)
    notes = Column(Text, nullable=True)
    is_completed = Column(Boolean, default=True, nullable=False)
    unpaid_notice_flag = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    session = relationship("Session", back_populates="photoshoot_record")
