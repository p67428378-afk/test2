from sqlalchemy import Column, String, DateTime, Enum as SQLAlchemyEnum
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from app.db.database import Base
import enum

class KYCStatus(enum.Enum):
    APPROVED = "APPROVED"
    FLAGGED = "FLAGGED"
    PENDING = "PENDING"

class KYCAudit(Base):
    __tablename__ = "kyc_audit"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    aadhaar_number = Column(String, index=True)
    pan_number = Column(String, index=True)
    status = Column(SQLAlchemyEnum(KYCStatus), default=KYCStatus.PENDING)
    failure_reason = Column(String, nullable=True)
    sanctions_match = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
