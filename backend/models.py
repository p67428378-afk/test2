
import uuid
from sqlalchemy import Column, String, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from .database import Base
import enum

class KYCStatus(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    FLAGGED = "FLAGGED"

class KYCRequest(Base):
    __tablename__ = "kyc_requests"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    aadhaar_number = Column(String, index=True)
    pan_number = Column(String, index=True)
    status = Column(Enum(KYCStatus), default=KYCStatus.PENDING)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class AuditTrail(Base):
    __tablename__ = "audit_trails"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    kyc_request_id = Column(UUID(as_uuid=True), index=True)
    action = Column(String)
    details = Column(String)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
