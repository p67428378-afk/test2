
import uuid
from sqlalchemy import Column, String, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from backend.database import Base
import datetime
import enum

class OTPStatus(enum.Enum):
    PENDING = "PENDING"
    VERIFIED = "VERIFIED"
    FAILED = "FAILED"

class BlockingStatus(enum.Enum):
    PENDING = "PENDING"
    BLOCKED = "BLOCKED"
    FAILED = "FAILED"

class BlockingRequest(Base):
    __tablename__ = "blocking_requests"

    request_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    card_identifier = Column(String, index=True)
    account_identifier = Column(String, index=True)
    customer_id = Column(String)
    otp_status = Column(Enum(OTPStatus), default=OTPStatus.PENDING)
    blocking_status = Column(Enum(BlockingStatus), default=BlockingStatus.PENDING)
    reference_number = Column(String, unique=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    source_channel = Column(String)
    audit_logs = relationship("AuditLog", back_populates="blocking_request")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    log_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    request_id = Column(UUID(as_uuid=True), ForeignKey("blocking_requests.request_id"))
    event_type = Column(String)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    user_id = Column(String)
    details = Column(String)
    blocking_request = relationship("BlockingRequest", back_populates="audit_logs")
