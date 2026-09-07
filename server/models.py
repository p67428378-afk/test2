import sys
import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from server.database import Base

# Aliasing sys.modules to prevent duplicate module loading ('models' vs 'server.models')
if __name__ == "server.models":
    sys.modules["models"] = sys.modules["server.models"]
elif __name__ == "models":
    sys.modules["server.models"] = sys.modules["models"]


def utc_now():
    return datetime.now(timezone.utc)


def generate_uuid():
    return str(uuid.uuid4())


class VisitorPreApproval(Base):
    __tablename__ = "visitors"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    unit_number = Column(String(50), nullable=False, index=True)
    visitor_name = Column(String(255), nullable=False)
    contact_phone = Column(String(30), nullable=False)
    vehicle_number = Column(String(30), nullable=True)
    created_by_user = Column(String(255), nullable=False, default="test@example.com")
    created_at = Column(DateTime(timezone=True), nullable=False, default=utc_now)

    qr_tokens = relationship(
        "QRToken", back_populates="visitor", cascade="all, delete-orphan"
    )


class QRToken(Base):
    __tablename__ = "qr_tokens"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    visitor_id = Column(String(36), ForeignKey("visitors.id"), nullable=False)
    token_signature = Column(Text, unique=True, nullable=False, index=True)
    valid_from = Column(DateTime(timezone=True), nullable=False)
    valid_until = Column(DateTime(timezone=True), nullable=False)
    status = Column(
        String(30), nullable=False, default="ACTIVE"
    )  # ACTIVE, USED, EXPIRED, REVOKED
    used_at = Column(DateTime(timezone=True), nullable=True)
    used_at_gate = Column(String(100), nullable=True)

    visitor = relationship("VisitorPreApproval", back_populates="qr_tokens")


class Delivery(Base):
    __tablename__ = "deliveries"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    unit_number = Column(String(50), nullable=False, index=True)
    courier_name = Column(String(100), nullable=False)
    tracking_number = Column(String(100), nullable=True)
    package_description = Column(Text, nullable=True)
    status = Column(
        String(30), nullable=False, default="PENDING_PICKUP"
    )  # PENDING_PICKUP, COLLECTED
    logged_at = Column(DateTime(timezone=True), nullable=False, default=utc_now)
    collected_at = Column(DateTime(timezone=True), nullable=True)


class SecurityAlert(Base):
    __tablename__ = "security_alerts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    alert_type = Column(String(50), nullable=False)
    severity = Column(
        String(20), nullable=False, default="HIGH"
    )  # INFO, MEDIUM, HIGH, CRITICAL
    location = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(
        String(30), nullable=False, default="ACTIVE"
    )  # ACTIVE, CANCELLED, RESOLVED
    cancellation_reason = Column(Text, nullable=True)
    cancelled_by = Column(String(255), nullable=True)
    cancelled_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, default=utc_now)
    updated_at = Column(
        DateTime(timezone=True), nullable=False, default=utc_now, onupdate=utc_now
    )
