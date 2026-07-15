import uuid
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Date, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from server.database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(
        String(50), default="visitor", nullable=False
    )  # visitor, staff, security
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    visitor_profile = relationship(
        "VisitorProfile", back_populates="user", uselist=False
    )
    flagged_actions = relationship(
        "SecurityFlag",
        back_populates="flagged_by_user",
        foreign_keys="[SecurityFlag.flagged_by]",
    )


class VisitorProfile(Base):
    __tablename__ = "visitors_profiles"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False
    )
    full_name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    gov_id = Column(String(255), unique=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    is_flagged = Column(Boolean, default=False, nullable=False)

    user = relationship("User", back_populates="visitor_profile")
    appointments = relationship("Appointment", back_populates="visitor")
    security_flags = relationship("SecurityFlag", back_populates="visitor")


class Inmate(Base):
    __tablename__ = "inmates"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name = Column(String(255), nullable=False)
    inmate_number = Column(String(50), unique=True, nullable=False)
    cell_location = Column(String(50), nullable=True)

    appointments = relationship("Appointment", back_populates="inmate")


class Appointment(Base):
    __tablename__ = "appointments"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    visitor_id = Column(
        UUID(as_uuid=True), ForeignKey("visitors_profiles.id"), nullable=False
    )
    inmate_id = Column(UUID(as_uuid=True), ForeignKey("inmates.id"), nullable=False)
    requested_date = Column(Date, nullable=False)
    time_slot = Column(String(100), nullable=False)
    status = Column(
        String(50), default="pending", nullable=False
    )  # pending, approved, denied
    denial_reason = Column(Text, nullable=True)

    visitor = relationship("VisitorProfile", back_populates="appointments")
    inmate = relationship("Inmate", back_populates="appointments")
    visit_logs = relationship("VisitLog", back_populates="appointment")


class VisitLog(Base):
    __tablename__ = "visit_logs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    appointment_id = Column(
        UUID(as_uuid=True), ForeignKey("appointments.id"), nullable=False
    )
    check_in_time = Column(DateTime, nullable=True)
    check_out_time = Column(DateTime, nullable=True)
    status = Column(
        String(50), default="scheduled", nullable=False
    )  # scheduled, checked-in, completed, aborted, cancelled

    appointment = relationship("Appointment", back_populates="visit_logs")


class SecurityFlag(Base):
    __tablename__ = "security_flags"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    visitor_id = Column(
        UUID(as_uuid=True), ForeignKey("visitors_profiles.id"), nullable=False
    )
    reason = Column(Text, nullable=False)
    flagged_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)

    visitor = relationship("VisitorProfile", back_populates="security_flags")
    flagged_by_user = relationship(
        "User", back_populates="flagged_actions", foreign_keys=[flagged_by]
    )
