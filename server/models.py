import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Boolean, DateTime, ForeignKey, Text
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
    role = Column(String(50), nullable=False, default="user")
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), nullable=False, default=utc_now)


class Fine(Base):
    __tablename__ = "fines"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    ticket_number = Column(String(50), unique=True, index=True, nullable=False)
    license_plate = Column(String(50), index=True, nullable=False)
    violation_type = Column(String(100), nullable=False)
    location = Column(String(255), nullable=False)
    amount = Column(Float, nullable=False)
    status = Column(String(50), nullable=False, default="UNPAID")
    issue_date = Column(DateTime(timezone=True), nullable=False, default=utc_now)
    due_date = Column(DateTime(timezone=True), nullable=False)
    payment_timestamp = Column(DateTime(timezone=True), nullable=True)
    transaction_reference = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, default=utc_now)
    updated_at = Column(
        DateTime(timezone=True), nullable=False, default=utc_now, onupdate=utc_now
    )

    audit_logs = relationship(
        "AuditLog", back_populates="fine", cascade="all, delete-orphan"
    )


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    fine_id = Column(String(36), ForeignKey("fines.id"), nullable=True)
    actor_id = Column(String(255), nullable=False)
    action = Column(String(50), nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, default=utc_now)

    fine = relationship("Fine", back_populates="audit_logs")
