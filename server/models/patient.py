import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Date, Text, DateTime
from sqlalchemy.orm import relationship
from server.database import Base


class Patient(Base):
    __tablename__ = "patients"

    id = Column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        unique=True,
        nullable=False,
    )
    name = Column(String(255), nullable=False)
    date_of_birth = Column(Date, nullable=False)
    gender = Column(String(50), nullable=False)
    phone = Column(String(50), nullable=True)
    email = Column(String(255), nullable=True)
    address = Column(Text, nullable=True)
    insurance_provider = Column(String(255), nullable=True)
    insurance_policy_number = Column(String(255), nullable=True)
    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
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
