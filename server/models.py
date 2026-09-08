import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from server.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="resident", nullable=False)
    unit_number = Column(String(50), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    visitors = relationship(
        "server.models.Visitor",
        back_populates="resident",
        cascade="all, delete-orphan",
    )
    recurring_passes = relationship(
        "server.models.RecurringPass",
        back_populates="resident",
        cascade="all, delete-orphan",
    )
    deliveries = relationship(
        "server.models.Delivery",
        foreign_keys="server.models.Delivery.resident_id",
        back_populates="resident",
    )
    security_alerts = relationship(
        "server.models.SecurityAlert", back_populates="reporter"
    )


class Visitor(Base):
    __tablename__ = "visitors"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    resident_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    unit_number = Column(String(50), nullable=True, index=True)
    visitor_name = Column(String(255), nullable=False)
    phone_number = Column(String(50), nullable=False)
    vehicle_number = Column(String(50), nullable=True)
    assigned_parking_slot = Column(String(50), nullable=True)
    expected_arrival = Column(DateTime, nullable=False)
    expected_departure = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    resident = relationship("server.models.User", back_populates="visitors")
    qr_tokens = relationship(
        "server.models.QRToken",
        back_populates="visitor",
        cascade="all, delete-orphan",
    )
    parking_allocations = relationship(
        "server.models.ParkingAllocation",
        back_populates="visitor",
        cascade="all, delete-orphan",
    )

    @property
    def visitor_id(self) -> str:
        return str(self.id)

    @property
    def valid_from(self) -> datetime:
        return self.expected_arrival

    @property
    def valid_until(self) -> datetime:
        return self.expected_departure

    @property
    def qr_token(self) -> str:
        return self.qr_tokens[0].token_signature if self.qr_tokens else ""

    @property
    def qr_token_id(self) -> str:
        return str(self.qr_tokens[0].id) if self.qr_tokens else ""

    @property
    def qr_code_payload(self) -> str:
        return self.qr_token


class RecurringPass(Base):
    __tablename__ = "recurring_passes"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    resident_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    visitor_name = Column(String(255), nullable=False)
    service_type = Column(String(100), nullable=False)
    days_of_week = Column(String(100), nullable=False)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    access_start_time = Column(String(10), nullable=False)
    access_end_time = Column(String(10), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    resident = relationship("server.models.User", back_populates="recurring_passes")
    qr_tokens = relationship(
        "server.models.QRToken",
        back_populates="recurring_pass",
        cascade="all, delete-orphan",
    )


class QRToken(Base):
    __tablename__ = "qr_tokens"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    visitor_id = Column(
        String(36), ForeignKey("visitors.id"), nullable=True, index=True
    )
    recurring_pass_id = Column(
        String(36), ForeignKey("recurring_passes.id"), nullable=True, index=True
    )
    token_signature = Column(String(512), unique=True, index=True, nullable=False)
    valid_from = Column(DateTime, nullable=False)
    valid_until = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False, nullable=False)
    is_recurring = Column(Boolean, default=False, nullable=False)
    entry_timestamp = Column(DateTime, nullable=True)
    exit_timestamp = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    visitor = relationship("server.models.Visitor", back_populates="qr_tokens")
    recurring_pass = relationship(
        "server.models.RecurringPass", back_populates="qr_tokens"
    )


class ParkingAllocation(Base):
    __tablename__ = "parking_allocations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    visitor_id = Column(
        String(36), ForeignKey("visitors.id"), nullable=False, index=True
    )
    vehicle_number = Column(String(50), nullable=False)
    slot_number = Column(String(50), nullable=False)
    entry_time = Column(DateTime, nullable=False)
    expected_exit_time = Column(DateTime, nullable=False)
    actual_exit_time = Column(DateTime, nullable=True)
    overstay_flag = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    visitor = relationship(
        "server.models.Visitor", back_populates="parking_allocations"
    )


class Delivery(Base):
    __tablename__ = "deliveries"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    unit_number = Column(String(50), nullable=False, index=True)
    resident_id = Column(String(36), ForeignKey("users.id"), nullable=True, index=True)
    courier_company = Column(String(100), nullable=False)
    tracking_number = Column(String(100), nullable=True)
    package_description = Column(String(255), nullable=True)
    status = Column(String(50), default="Pending Pickup", nullable=False)
    logged_by_guard_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    logged_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    collected_at = Column(DateTime, nullable=True)

    resident = relationship(
        "server.models.User",
        foreign_keys=[resident_id],
        back_populates="deliveries",
    )
    logged_by_guard = relationship(
        "server.models.User", foreign_keys=[logged_by_guard_id]
    )

    @property
    def courier_name(self) -> str:
        return str(self.courier_company)


class SecurityAlert(Base):
    __tablename__ = "security_alerts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    reporter_id = Column(String(36), ForeignKey("users.id"), nullable=True, index=True)
    severity = Column(String(20), nullable=False)
    alert_type = Column(String(50), nullable=False)
    location_tag = Column(String(100), nullable=False)
    description = Column(String(255), nullable=True)
    status = Column(String(50), default="ACTIVE", nullable=False)
    cancel_reason = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    reporter = relationship("server.models.User", back_populates="security_alerts")

    @property
    def location(self) -> str:
        return str(self.location_tag)
