from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from .database import Base

class LinkedAccount(Base):
    __tablename__ = "linked_accounts"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    customer_id = Column(String, index=True)
    checking_account_id = Column(String, unique=True, index=True)
    savings_account_id = Column(String, unique=True, index=True)
    is_enabled = Column(Boolean, default=True)
    linked_date = Column(DateTime(timezone=True), server_default=func.now())

class OverdraftTransferEvent(Base):
    __tablename__ = "overdraft_transfer_events"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    transaction_id = Column(String, index=True)
    checking_account_id = Column(String, index=True)
    savings_account_id = Column(String, index=True)
    amount = Column(Float)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String) # e.g., "Success", "Failed"
    reason = Column(String, nullable=True)

class NotificationLog(Base):
    __tablename__ = "notification_logs"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    event_id = Column(String, ForeignKey("overdraft_transfer_events.id"))
    recipient = Column(String)
    channel = Column(String) # e.g., "SMS", "Email"
    message = Column(String)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String) # e.g., "Sent", "Failed"

    event = relationship("OverdraftTransferEvent")
