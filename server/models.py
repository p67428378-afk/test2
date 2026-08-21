import uuid
from datetime import datetime
from sqlalchemy import (
    Column,
    String,
    Boolean,
    DateTime,
    Date,
    Integer,
    Float,
    Text,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from server.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(
        String(50), nullable=False, default="Patient"
    )  # Admin, Doctor, Nurse, Receptionist, Patient
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    schedules = relationship(
        "DoctorSchedule", back_populates="doctor", cascade="all, delete-orphan"
    )


class Patient(Base):
    __tablename__ = "patients"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    ssn_gov_id = Column(String(100), unique=True, index=True, nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    dob = Column(Date, nullable=False)
    gender = Column(String(20), nullable=False)
    phone = Column(String(50), nullable=False)
    emergency_contact = Column(String(100), nullable=False)
    medical_history = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    appointments = relationship(
        "Appointment", back_populates="patient", cascade="all, delete-orphan"
    )
    medical_records = relationship(
        "MedicalRecord", back_populates="patient", cascade="all, delete-orphan"
    )
    invoices = relationship(
        "Invoice", back_populates="patient", cascade="all, delete-orphan"
    )


class DoctorSchedule(Base):
    __tablename__ = "doctor_schedules"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    doctor_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    day_of_week = Column(String(20), nullable=False)  # e.g. Monday
    start_time = Column(String(20), nullable=False)  # e.g. 09:00:00
    end_time = Column(String(20), nullable=False)  # e.g. 17:00:00
    slot_duration_minutes = Column(Integer, default=30, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    doctor = relationship("User", back_populates="schedules")


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String(36), ForeignKey("patients.id"), nullable=False)
    doctor_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    appointment_time = Column(DateTime, nullable=False)
    status = Column(
        String(50), default="SCHEDULED", nullable=False
    )  # SCHEDULED, CONFIRMED, COMPLETED, CANCELLED
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    patient = relationship("Patient", back_populates="appointments")
    doctor = relationship("User")
    medical_records = relationship(
        "MedicalRecord", back_populates="appointment", cascade="all, delete-orphan"
    )
    invoices = relationship(
        "Invoice", back_populates="appointment", cascade="all, delete-orphan"
    )


class MedicalRecord(Base):
    __tablename__ = "medical_records"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String(36), ForeignKey("patients.id"), nullable=False)
    doctor_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    appointment_id = Column(String(36), ForeignKey("appointments.id"), nullable=False)
    diagnosis = Column(Text, nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    patient = relationship("Patient", back_populates="medical_records")
    doctor = relationship("User")
    appointment = relationship("Appointment", back_populates="medical_records")
    prescriptions = relationship(
        "Prescription", back_populates="medical_record", cascade="all, delete-orphan"
    )


class Prescription(Base):
    __tablename__ = "prescriptions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    medical_record_id = Column(
        String(36), ForeignKey("medical_records.id"), nullable=False
    )
    medication_name = Column(String(255), nullable=False)
    dosage = Column(String(100), nullable=False)
    instructions = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    medical_record = relationship("MedicalRecord", back_populates="prescriptions")


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    appointment_id = Column(String(36), ForeignKey("appointments.id"), nullable=False)
    patient_id = Column(String(36), ForeignKey("patients.id"), nullable=False)
    amount = Column(Float, nullable=False)
    status = Column(
        String(50), default="PENDING", nullable=False
    )  # PENDING, PAID, REFUNDED
    itemized_details = Column(Text, nullable=True)  # JSON formatted string
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    appointment = relationship("Appointment", back_populates="invoices")
    patient = relationship("Patient", back_populates="invoices")
