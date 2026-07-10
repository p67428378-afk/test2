import uuid
from sqlalchemy import Column, String, DateTime, Date, ForeignKey, Text, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from server.database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)  # 'staff', 'security', 'visitor'
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    # Relationships
    approved_appointments = relationship(
        "Appointment",
        back_populates="approved_by_staff",
        foreign_keys="[Appointment.approved_by_staff_id]",
    )
    supervised_visits = relationship(
        "VisitLog",
        back_populates="supervising_officer",
        foreign_keys="[VisitLog.supervising_officer_id]",
    )

    # Existing relationships from password reset
    otps = relationship("OTP", back_populates="user")
    password_history = relationship("PasswordHistory", back_populates="user")


class Visitor(Base):
    __tablename__ = "visitors"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    date_of_birth = Column(Date, nullable=False)
    id_document_url = Column(String(512), nullable=True)
    id_verification_status = Column(
        String(50), default="pending", nullable=False
    )  # 'pending', 'verified', 'rejected'
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    # Relationships
    appointments = relationship("Appointment", back_populates="visitor")


class Inmate(Base):
    __tablename__ = "inmates"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name = Column(String(255), nullable=False)
    inmate_id_number = Column(String(100), unique=True, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    # Relationships
    appointments = relationship("Appointment", back_populates="inmate")


class Appointment(Base):
    __tablename__ = "appointments"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    visitor_id = Column(UUID(as_uuid=True), ForeignKey("visitors.id"), nullable=False)
    inmate_id = Column(UUID(as_uuid=True), ForeignKey("inmates.id"), nullable=False)
    requested_datetime = Column(DateTime, nullable=False)
    status = Column(
        String(50), default="pending", nullable=False
    )  # 'pending', 'approved', 'denied'
    approved_by_staff_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=True
    )
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    # Relationships
    visitor = relationship("Visitor", back_populates="appointments")
    inmate = relationship("Inmate", back_populates="appointments")
    approved_by_staff = relationship(
        "User",
        back_populates="approved_appointments",
        foreign_keys=[approved_by_staff_id],
    )
    visit_log = relationship("VisitLog", back_populates="appointment", uselist=False)


class VisitLog(Base):
    __tablename__ = "visit_logs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    appointment_id = Column(
        UUID(as_uuid=True), ForeignKey("appointments.id"), nullable=False
    )
    check_in_time = Column(DateTime, nullable=False)
    check_out_time = Column(DateTime, nullable=True)
    supervising_officer_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    # Relationships
    appointment = relationship("Appointment", back_populates="visit_log")
    supervising_officer = relationship(
        "User",
        back_populates="supervised_visits",
        foreign_keys=[supervising_officer_id],
    )


# Existing models from password reset
class OTP(Base):
    __tablename__ = "otps"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    otp_code_hash = Column(String(255), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())

    user = relationship("User", back_populates="otps")


class PasswordHistory(Base):
    __tablename__ = "password_history"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    changed_at = Column(DateTime, default=func.now())

    user = relationship("User", back_populates="password_history")
