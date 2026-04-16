
from sqlalchemy import Column, Integer, String, DateTime, Enum, JSON
from sqlalchemy.sql import func
from .database import Base
import enum

class RequestType(str, enum.Enum):
    UPDATE = "UPDATE"
    CANCEL = "CANCEL"

class RequestStatus(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"

class PolicyChangeRequest(Base):
    __tablename__ = "policy_change_requests"

    id = Column(Integer, primary_key=True, index=True)
    policy_id = Column(String, index=True, nullable=False)
    request_type = Column(Enum(RequestType), nullable=False)
    request_details = Column(JSON)
    request_status = Column(Enum(RequestStatus), default=RequestStatus.PENDING)
    submitted_by = Column(String, nullable=False)
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
    processed_by = Column(String)
    processed_at = Column(DateTime(timezone=True))
