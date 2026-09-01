import uuid
from datetime import date as date_type, datetime, time as time_type
from typing import List, Optional
from sqlalchemy import Boolean, Date, DateTime, ForeignKey, Integer, String, Text, Time
from sqlalchemy.orm import Mapped, mapped_column, relationship as orm_relationship
from server.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    email: Mapped[str] = mapped_column(
        String(255), unique=True, index=True, nullable=False
    )
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(
        String(50), default="visitor", nullable=False
    )  # visitor, admin, officer
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )


class Visitor(Base):
    __tablename__ = "visitors"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    national_id: Mapped[str] = mapped_column(
        String(100), unique=True, index=True, nullable=False
    )
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    address: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    photo_id_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    verification_status: Mapped[str] = mapped_column(
        String(50), default="PENDING", nullable=False
    )  # PENDING, VERIFIED, REJECTED
    visitor_type: Mapped[str] = mapped_column(
        String(50), default="STANDARD", nullable=False
    )  # STANDARD, LEGAL
    is_watchlist_flagged: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    appointments: Mapped[List["Appointment"]] = orm_relationship(
        "Appointment", back_populates="visitor", cascade="all, delete-orphan"
    )
    verifications: Mapped[List["Verification"]] = orm_relationship(
        "Verification", back_populates="visitor", cascade="all, delete-orphan"
    )


class Inmate(Base):
    __tablename__ = "inmates"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    inmate_number: Mapped[str] = mapped_column(
        String(100), unique=True, index=True, nullable=False
    )
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    cell_location: Mapped[str] = mapped_column(String(100), nullable=False)
    security_level: Mapped[str] = mapped_column(
        String(50), default="MEDIUM", nullable=False
    )  # LOW, MEDIUM, HIGH, MAXIMUM
    weekly_visit_limit: Mapped[int] = mapped_column(Integer, default=2, nullable=False)
    status: Mapped[str] = mapped_column(
        String(50), default="ACTIVE", nullable=False
    )  # ACTIVE, RELEASED, TRANSFERRED
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    appointments: Mapped[List["Appointment"]] = orm_relationship(
        "Appointment", back_populates="inmate", cascade="all, delete-orphan"
    )


class Appointment(Base):
    __tablename__ = "appointments"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    visitor_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("visitors.id"), nullable=False
    )
    inmate_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("inmates.id"), nullable=False
    )
    visit_date: Mapped[date_type] = mapped_column(Date, nullable=False)
    start_time: Mapped[time_type] = mapped_column(Time, nullable=False)
    slot_duration_minutes: Mapped[int] = mapped_column(
        Integer, default=30, nullable=False
    )  # 30 (Standard) or 60 (Legal)
    relationship: Mapped[str] = mapped_column(String(100), nullable=False)
    status: Mapped[str] = mapped_column(
        String(50), default="PENDING", nullable=False
    )  # PENDING, APPROVED, REJECTED, COMPLETED, CANCELLED
    security_flag_status: Mapped[str] = mapped_column(
        String(50), default="CLEARED", nullable=False
    )  # CLEARED, FLAGGED
    rejection_reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    visitor: Mapped["Visitor"] = orm_relationship(
        "Visitor", back_populates="appointments"
    )
    inmate: Mapped["Inmate"] = orm_relationship("Inmate", back_populates="appointments")
    digital_pass: Mapped[Optional["DigitalPass"]] = orm_relationship(
        "DigitalPass",
        back_populates="appointment",
        uselist=False,
        cascade="all, delete-orphan",
    )
    entry_exit_logs: Mapped[List["EntryExitLog"]] = orm_relationship(
        "EntryExitLog", back_populates="appointment", cascade="all, delete-orphan"
    )


class Verification(Base):
    __tablename__ = "verifications"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    visitor_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("visitors.id"), nullable=False
    )
    officer_id: Mapped[str] = mapped_column(String(36), nullable=False)
    verification_status: Mapped[str] = mapped_column(
        String(50), nullable=False
    )  # VERIFIED, REJECTED, PENDING
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )

    visitor: Mapped["Visitor"] = orm_relationship(
        "Visitor", back_populates="verifications"
    )


class EntryExitLog(Base):
    __tablename__ = "entry_exit_logs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    appointment_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("appointments.id"), nullable=False
    )
    officer_id: Mapped[str] = mapped_column(String(36), nullable=False)
    check_in_time: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    check_out_time: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    entry_method: Mapped[str] = mapped_column(
        String(50), default="MANUAL", nullable=False
    )  # MANUAL, QR_SCAN
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )

    appointment: Mapped["Appointment"] = orm_relationship(
        "Appointment", back_populates="entry_exit_logs"
    )


class WatchlistEntry(Base):
    __tablename__ = "watchlist_entries"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    national_id: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    reason: Mapped[str] = mapped_column(Text, nullable=False)
    severity_level: Mapped[str] = mapped_column(
        String(50), default="HIGH", nullable=False
    )  # LOW, MEDIUM, HIGH, CRITICAL
    flagged_by: Mapped[str] = mapped_column(String(36), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )


class DigitalPass(Base):
    __tablename__ = "digital_passes"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    appointment_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("appointments.id"), unique=True, nullable=False
    )
    pass_token: Mapped[str] = mapped_column(Text, nullable=False)
    qr_code_data_url: Mapped[str] = mapped_column(Text, nullable=False)
    pdf_download_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    is_used: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )

    appointment: Mapped["Appointment"] = orm_relationship(
        "Appointment", back_populates="digital_pass"
    )
