import uuid
from sqlalchemy import Column, String, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID
from backend.app.database import Base
import enum
from datetime import datetime

class KYCStatus(str, enum.Enum):
    APPROVED = "APPROVED"
    FLAGGED = "FLAGGED"
    PENDING = "PENDING"

class KYC(Base):
    __tablename__ = "kyc_records"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    aadhaar_number = Column(String, index=True)
    pan_number = Column(String, index=True)
    status = Column(Enum(KYCStatus), default=KYCStatus.PENDING)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
