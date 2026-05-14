
from sqlalchemy import Column, String, Float, DateTime, JSON, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from server.database import Base

class RechargeRequest(Base):
    __tablename__ = "recharge_requests"

    request_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String(255), nullable=False)
    account_number = Column(String(255), nullable=False)
    operator = Column(String(255), nullable=False)
    amount = Column(Float, nullable=False)
    service_type = Column(String(50), nullable=False)
    status = Column(String(50), nullable=False, default="INITIATED")
    bank_transaction_id = Column(String(255))
    operator_reference = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class TransactionLog(Base):
    __tablename__ = "transaction_logs"

    log_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    request_id = Column(UUID(as_uuid=True), ForeignKey('recharge_requests.request_id'))
    timestamp = Column(DateTime, default=datetime.utcnow)
    event_type = Column(String(255), nullable=False)
    details = Column(JSON)

class Configuration(Base):
    __tablename__ = "configurations"

    key = Column(String(255), primary_key=True)
    value = Column(String(255), nullable=False)
    description = Column(String(255))
