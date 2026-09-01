import uuid
from datetime import datetime
from sqlalchemy import (
    Column,
    String,
    Boolean,
    DateTime,
    Date,
    Float,
    ForeignKey,
    Text,
    JSON,
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


def generate_uuid() -> str:
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(
        String(50), nullable=False, default="Patient"
    )  # Admin, Doctor, Staff, Patient
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    patient_profile = relationship("Patient", back_populates="user", uselist=False)
    doctor_slots = relationship("DoctorSlot", back_populates="doctor")
    doctor_appointments = relationship(
        "Appointment", foreign_keys="Appointment.doctor_id", back_populates="doctor"
    )
    emr_records = relationship(
        "EMRRecord", foreign_keys="EMRRecord.doctor_id", back_populates="doctor"
    )


class Patient(Base):
    __tablename__ = "patients"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    full_name = Column(String(255), nullable=False, index=True)
    date_of_birth = Column(Date, nullable=False)
    gender = Column(String(50), nullable=False)
    phone = Column(String(50), nullable=False, index=True)
    emergency_contact = Column(String(255), nullable=False)
    medical_history = Column(Text, nullable=True)
    insurance_provider = Column(String(255), nullable=True)
    insurance_policy_number = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    user = relationship("User", back_populates="patient_profile")
    appointments = relationship("Appointment", back_populates="patient")
    emr_records = relationship("EMRRecord", back_populates="patient")
    invoices = relationship("Invoice", back_populates="patient")


class DoctorSlot(Base):
    __tablename__ = "doctor_slots"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    doctor_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    department = Column(String(100), nullable=False, index=True)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    is_booked = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    doctor = relationship("User", back_populates="doctor_slots")
    appointment = relationship("Appointment", back_populates="slot", uselist=False)


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    patient_id = Column(
        String(36), ForeignKey("patients.id"), nullable=False, index=True
    )
    doctor_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    slot_id = Column(
        String(36), ForeignKey("doctor_slots.id"), nullable=False, unique=True
    )
    status = Column(
        String(50), default="Scheduled", nullable=False
    )  # Scheduled, In-Progress, Completed, Cancelled
    reason_for_visit = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    patient = relationship("Patient", back_populates="appointments")
    doctor = relationship(
        "User", foreign_keys=[doctor_id], back_populates="doctor_appointments"
    )
    slot = relationship("DoctorSlot", back_populates="appointment")
    emr_records = relationship("EMRRecord", back_populates="appointment")
    invoices = relationship("Invoice", back_populates="appointment")


class EMRRecord(Base):
    __tablename__ = "emr_records"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    appointment_id = Column(
        String(36), ForeignKey("appointments.id"), nullable=False, index=True
    )
    patient_id = Column(
        String(36), ForeignKey("patients.id"), nullable=False, index=True
    )
    doctor_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    diagnosis = Column(Text, nullable=False)
    clinical_notes = Column(Text, nullable=False)
    prescriptions = Column(JSON, default=list, nullable=False)
    lab_orders = Column(JSON, default=list, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    appointment = relationship("Appointment", back_populates="emr_records")
    patient = relationship("Patient", back_populates="emr_records")
    doctor = relationship(
        "User", foreign_keys=[doctor_id], back_populates="emr_records"
    )


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    appointment_id = Column(
        String(36), ForeignKey("appointments.id"), nullable=False, index=True
    )
    patient_id = Column(
        String(36), ForeignKey("patients.id"), nullable=False, index=True
    )
    total_amount = Column(Float, nullable=False)
    line_items = Column(JSON, default=list, nullable=False)
    payment_status = Column(
        String(50), default="Pending", nullable=False
    )  # Pending, Paid, Refunded
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    appointment = relationship("Appointment", back_populates="invoices")
    patient = relationship("Patient", back_populates="invoices")
