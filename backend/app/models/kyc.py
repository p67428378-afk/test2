import uuid
from sqlalchemy import Column, String, DateTime, JSON, Enum as SQLAlchemyEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.db.database import Base
import enum

class KYCStatus(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    FLAGGED = "FLAGGED"

class CustomerKYC(Base):
    __tablename__ = "customer_kyc"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = Column(String, unique=True, index=True, nullable=False)
    aadhaar_number = Column(String, nullable=False)
    pan_number = Column(String, nullable=False)
    validation_status_aadhaar = Column(String, default="PENDING")
    validation_status_pan = Column(String, default="PENDING")
    sanctions_screening_status = Column(String, default="PENDING")
    final_kyc_status = Column(SQLAlchemyEnum(KYCStatus), default=KYCStatus.PENDING)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class KYCAuditLog(Base):
    __tablename__ = "kyc_audit_log"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    kyc_id = Column(UUID(as_uuid=True), nullable=False)
    event_timestamp = Column(DateTime(timezone=True), server_default=func.now())
    event_type = Column(String, nullable=False)
    event_details = Column(JSON, nullable=True)
    service_involved = Column(String, nullable=False)
    outcome = Column(String, nullable=False)
    initiator = Column(String, nullable=False)
