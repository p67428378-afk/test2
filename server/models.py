import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from server.database import Base


def generate_uuid():
    return str(uuid.uuid4())


def utc_now():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, default="owner", nullable=False)  # owner, vet, admin
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = Column(
        DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False
    )

    pets = relationship("Pet", back_populates="owner", cascade="all, delete-orphan")
    vet_appointments = relationship(
        "Appointment", foreign_keys="Appointment.vet_id", back_populates="vet"
    )
    vet_medical_records = relationship(
        "MedicalRecord", foreign_keys="MedicalRecord.vet_id", back_populates="vet"
    )
    vet_vaccinations = relationship(
        "Vaccination", foreign_keys="Vaccination.vet_id", back_populates="vet"
    )


class Pet(Base):
    __tablename__ = "pets"

    id = Column(String, primary_key=True, default=generate_uuid)
    owner_id = Column(String, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    species = Column(String, nullable=False)
    breed = Column(String, nullable=True)
    age = Column(Integer, nullable=True)
    weight = Column(Float, nullable=True)
    gender = Column(String, nullable=True)
    microchip_number = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = Column(
        DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False
    )

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

    id = Column(String, primary_key=True, default=generate_uuid)
    pet_id = Column(String, ForeignKey("pets.id"), nullable=False)
    vet_id = Column(String, ForeignKey("users.id"), nullable=True)
    appointment_date = Column(DateTime(timezone=True), nullable=False)
    reason = Column(String, nullable=False)
    status = Column(
        String, default="SCHEDULED", nullable=False
    )  # SCHEDULED, COMPLETED, CANCELLED
    notes = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = Column(
        DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False
    )

    pet = relationship("Pet", back_populates="appointments")
    vet = relationship("User", foreign_keys=[vet_id], back_populates="vet_appointments")
    medical_records = relationship("MedicalRecord", back_populates="appointment")


class MedicalRecord(Base):
    __tablename__ = "medical_records"

    id = Column(String, primary_key=True, default=generate_uuid)
    appointment_id = Column(String, ForeignKey("appointments.id"), nullable=True)
    pet_id = Column(String, ForeignKey("pets.id"), nullable=False)
    vet_id = Column(String, ForeignKey("users.id"), nullable=True)
    visit_date = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    diagnosis = Column(String, nullable=True)
    treatment = Column(String, nullable=True)
    prescriptions = Column(String, nullable=True)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = Column(
        DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False
    )

    pet = relationship("Pet", back_populates="medical_records")
    vet = relationship(
        "User", foreign_keys=[vet_id], back_populates="vet_medical_records"
    )
    appointment = relationship("Appointment", back_populates="medical_records")


class Vaccination(Base):
    __tablename__ = "vaccinations"

    id = Column(String, primary_key=True, default=generate_uuid)
    pet_id = Column(String, ForeignKey("pets.id"), nullable=False)
    vaccine_name = Column(String, nullable=False)
    administered_date = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    next_due_date = Column(DateTime(timezone=True), nullable=True)
    vet_id = Column(String, ForeignKey("users.id"), nullable=True)
    status = Column(
        String, default="UP_TO_DATE", nullable=False
    )  # UP_TO_DATE, DUE_SOON, OVERDUE
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = Column(
        DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False
    )

    pet = relationship("Pet", back_populates="vaccinations")
    vet = relationship("User", foreign_keys=[vet_id], back_populates="vet_vaccinations")
    reminders = relationship(
        "Reminder", back_populates="vaccination", cascade="all, delete-orphan"
    )


class Reminder(Base):
    __tablename__ = "reminders"

    id = Column(String, primary_key=True, default=generate_uuid)
    pet_id = Column(String, ForeignKey("pets.id"), nullable=False)
    vaccination_id = Column(String, ForeignKey("vaccinations.id"), nullable=True)
    reminder_type = Column(
        String, default="VACCINATION", nullable=False
    )  # VACCINATION, APPOINTMENT
    status = Column(
        String, default="PENDING", nullable=False
    )  # PENDING, SENT, CANCELLED
    scheduled_date = Column(DateTime(timezone=True), nullable=False)
    sent_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = Column(
        DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False
    )

    pet = relationship("Pet", back_populates="reminders")
    vaccination = relationship("Vaccination", back_populates="reminders")
