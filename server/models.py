import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Integer,
    Float,
    Boolean,
    DateTime,
    ForeignKey,
    Text,
)
from sqlalchemy.orm import relationship
from server.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    role = Column(String(50), default="owner", nullable=False)  # owner, vet, admin
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=True, nullable=False)
    email_verified = Column(Boolean, default=True, nullable=False)
    disabled = Column(Boolean, default=False, nullable=False)
    is_locked = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)

    pets = relationship("Pet", back_populates="owner", cascade="all, delete-orphan")
    vet_appointments = relationship("Appointment", back_populates="vet")
    vet_medical_records = relationship("MedicalRecord", back_populates="vet")
    vet_vaccinations = relationship("Vaccination", back_populates="vet")


class Pet(Base):
    __tablename__ = "pets"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    owner_id = Column(
        String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    name = Column(String(255), nullable=False)
    species = Column(String(100), nullable=False)
    breed = Column(String(255), nullable=True)
    age = Column(Integer, nullable=True)
    weight = Column(Float, nullable=True)
    gender = Column(String(50), nullable=True)
    microchip_number = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    owner = relationship("User", back_populates="pets")
    appointments = relationship(
        "Appointment", back_populates="pet", cascade="all, delete-orphan"
    )
    medical_records = relationship(
        "MedicalRecord", back_populates="pet", cascade="all, delete-orphan"
    )
    vaccinations = relationship(
        "Vaccination", back_populates="pet", cascade="all, delete-orphan"
    )
    reminders = relationship(
        "Reminder", back_populates="pet", cascade="all, delete-orphan"
    )


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    pet_id = Column(
        String(36), ForeignKey("pets.id", ondelete="CASCADE"), nullable=False
    )
    vet_id = Column(
        String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    appointment_date = Column(DateTime, nullable=False)
    reason = Column(String(255), nullable=False)
    status = Column(
        String(50), default="SCHEDULED", nullable=False
    )  # SCHEDULED, COMPLETED, CANCELLED
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    pet = relationship("Pet", back_populates="appointments")
    vet = relationship("User", back_populates="vet_appointments")
    medical_records = relationship("MedicalRecord", back_populates="appointment")


class MedicalRecord(Base):
    __tablename__ = "medical_records"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    appointment_id = Column(
        String(36), ForeignKey("appointments.id", ondelete="SET NULL"), nullable=True
    )
    pet_id = Column(
        String(36), ForeignKey("pets.id", ondelete="CASCADE"), nullable=False
    )
    vet_id = Column(
        String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    visit_date = Column(DateTime, default=utc_now, nullable=False)
    diagnosis = Column(String(255), nullable=True)
    treatment = Column(Text, nullable=True)
    prescriptions = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now, nullable=False)

    pet = relationship("Pet", back_populates="medical_records")
    appointment = relationship("Appointment", back_populates="medical_records")
    vet = relationship("User", back_populates="vet_medical_records")


class Vaccination(Base):
    __tablename__ = "vaccinations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    pet_id = Column(
        String(36), ForeignKey("pets.id", ondelete="CASCADE"), nullable=False
    )
    vet_id = Column(
        String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    vaccine_name = Column(String(255), nullable=False)
    administered_date = Column(DateTime, default=utc_now, nullable=True)
    next_due_date = Column(DateTime, nullable=True)
    status = Column(
        String(50), default="UP_TO_DATE", nullable=False
    )  # UP_TO_DATE, DUE_SOON, OVERDUE
    created_at = Column(DateTime, default=utc_now, nullable=False)

    pet = relationship("Pet", back_populates="vaccinations")
    vet = relationship("User", back_populates="vet_vaccinations")
    reminders = relationship(
        "Reminder", back_populates="vaccination", cascade="all, delete-orphan"
    )


class Reminder(Base):
    __tablename__ = "reminders"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    pet_id = Column(
        String(36), ForeignKey("pets.id", ondelete="CASCADE"), nullable=False
    )
    vaccination_id = Column(
        String(36), ForeignKey("vaccinations.id", ondelete="CASCADE"), nullable=True
    )
    reminder_type = Column(String(100), default="VACCINATION", nullable=False)
    scheduled_date = Column(DateTime, nullable=False)
    sent_at = Column(DateTime, nullable=True)
    status = Column(
        String(50), default="PENDING", nullable=False
    )  # PENDING, SENT, DISMISSED
    created_at = Column(DateTime, default=utc_now, nullable=False)

    pet = relationship("Pet", back_populates="reminders")
    vaccination = relationship("Vaccination", back_populates="reminders")
