import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from server.database import Base


class Prescription(Base):
    __tablename__ = "prescriptions"

    id = Column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        unique=True,
        nullable=False,
    )
    medical_record_id = Column(
        String(36), ForeignKey("medical_records.id"), nullable=False
    )
    medication_id = Column(String(36), ForeignKey("medications.id"), nullable=False)
    dosage = Column(String(255), nullable=False)
    frequency = Column(String(255), nullable=False)
    duration = Column(String(255), nullable=False)
    status = Column(String(50), default="pending", nullable=False)
    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    medical_record = relationship("MedicalRecord", back_populates="prescriptions")
    medication = relationship("Medication", back_populates="prescriptions")
