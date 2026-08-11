from sqlalchemy import Boolean, Column, String, DateTime, Float, ForeignKey, JSON, Integer
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from .database import Base

class AccountConfiguration(Base):
    __tablename__ = "account_configurations"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    checking_account_id = Column(String, unique=True, index=True)
    savings_account_id = Column(String, unique=True, index=True)
    is_enabled = Column(Boolean, default=True)
    notification_preferences = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    overdraft_transfer_events = relationship("OverdraftTransferEvent", back_populates="account_config")

class OverdraftTransferEvent(Base):
    __tablename__ = "overdraft_transfer_events"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    account_config_id = Column(String, ForeignKey("account_configurations.id"))
    transaction_id = Column(String, unique=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    amount = Column(Float)
    from_account = Column(String)
    to_account = Column(String)
    status = Column(String)
    details = Column(JSON, nullable=True)

    account_config = relationship("AccountConfiguration", back_populates="overdraft_transfer_events")
    notification_logs = relationship("NotificationLog", back_populates="overdraft_event")

class NotificationLog(Base):
    __tablename__ = "notification_logs"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    event_id = Column(String, ForeignKey("overdraft_transfer_events.id"))
    user_id = Column(String)
    type = Column(String) # SMS or Email
    recipient = Column(String)
    status = Column(String)
    attempt_count = Column(Integer, default=0)
    last_attempt_time = Column(DateTime(timezone=True), nullable=True)

    overdraft_event = relationship("OverdraftTransferEvent", back_populates="notification_logs")
