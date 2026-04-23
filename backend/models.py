import uuid
from sqlalchemy import Column, String, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID
from .database import Base
import enum
from datetime import datetime

class PurposeEnum(str, enum.Enum):
    VISA = "VISA"
    LOAN = "LOAN"
    OTHER = "OTHER"

class StatusEnum(str, enum.Enum):
    PENDING = "PENDING"
    GENERATED = "GENERATED"
    FAILED = "FAILED"

class CertificateRequest(Base):
    __tablename__ = "certificate_requests"

    requestId = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    accountNumber = Column(String, nullable=False)
    purpose = Column(Enum(PurposeEnum), nullable=False)
    requestTimestamp = Column(DateTime, default=datetime.utcnow)
    status = Column(Enum(StatusEnum), default=StatusEnum.PENDING)
    generatedPdfPath = Column(String, nullable=True)
