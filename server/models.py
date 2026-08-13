import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Boolean,
    Float,
    Integer,
    DateTime,
    ForeignKey,
    JSON,
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
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    role = Column(String(50), nullable=False, default="RENTER")  # RENTER, ADMIN
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    rentals = relationship("Rental", back_populates="user")


class Equipment(Base):
    __tablename__ = "equipment"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    category = Column(
        String(50), nullable=False, index=True
    )  # CAMERAS, DRONES, CONSTRUCTION_TOOLS
    daily_rate = Column(Float, nullable=False)
    deposit_amount = Column(Float, nullable=False)
    status = Column(
        String(50), nullable=False, default="AVAILABLE", index=True
    )  # AVAILABLE, RESERVED, CHECKED_OUT, MAINTENANCE
    specifications = Column(JSON, default=dict)
    version = Column(Integer, nullable=False, default=1)  # Optimistic locking version
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    rentals = relationship("Rental", back_populates="equipment")


class Rental(Base):
    __tablename__ = "rental"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    equipment_id = Column(
        String(36), ForeignKey("equipment.id"), nullable=False, index=True
    )
    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True), nullable=False)
    actual_return_date = Column(DateTime(timezone=True), nullable=True)
    status = Column(
        String(50), nullable=False, default="RESERVED", index=True
    )  # RESERVED, CHECKED_OUT, ACTIVE, RETURNED, OVERDUE
    payment_method_token = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    user = relationship("User", back_populates="rentals")
    equipment = relationship("Equipment", back_populates="rentals")
    transactions = relationship(
        "Transaction", back_populates="rental", cascade="all, delete-orphan"
    )


class Transaction(Base):
    __tablename__ = "transaction"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    rental_id = Column(String(36), ForeignKey("rental.id"), nullable=False, index=True)
    transaction_type = Column(
        String(50), nullable=False
    )  # DEPOSIT, RENTAL_FEE, LATE_FEE, REFUND
    amount = Column(Float, nullable=False)
    status = Column(
        String(50), nullable=False, default="COMPLETED"
    )  # PENDING, COMPLETED, FAILED, CANCELLED
    payment_gateway_ref = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    rental = relationship("Rental", back_populates="transactions")
