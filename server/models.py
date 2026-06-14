import uuid
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Numeric, Text, Uuid
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from server.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    login_id = Column(String(255), unique=True, nullable=False)
    mobile_number = Column(String(20), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    security_question = Column(String(255), nullable=False)
    security_answer_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    otps = relationship("OTP", back_populates="user")
    password_history = relationship("PasswordHistory", back_populates="user")
    accounts = relationship("Account", back_populates="user")
    audit_logs = relationship("AuditLog", back_populates="user")

class OTP(Base):
    __tablename__ = "otps"
    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid, ForeignKey("users.id"), nullable=False)
    otp_code_hash = Column(String(255), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())

    user = relationship("User", back_populates="otps")

class PasswordHistory(Base):
    __tablename__ = "password_history"
    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid, ForeignKey("users.id"), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    changed_at = Column(DateTime, default=func.now())

    user = relationship("User", back_populates="password_history")

class Account(Base):
    __tablename__ = "accounts"
    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid, ForeignKey("users.id"), nullable=False)
    account_number = Column(String(255), unique=True, nullable=False)
    ledger_balance = Column(Numeric(15, 2), default=0.00, nullable=False)
    available_balance = Column(Numeric(15, 2), default=0.00, nullable=False)
    currency = Column(String(10), default="USD", nullable=False)
    daily_transaction_limit = Column(Numeric(15, 2), default=5000.00, nullable=False)
    remaining_daily_limit = Column(Numeric(15, 2), default=5000.00, nullable=False)
    status = Column(String(50), default="ACTIVE", nullable=False)
    reason_code = Column(String(50), default=None, nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="accounts")
    audit_logs = relationship("AuditLog", back_populates="account")
    transactions = relationship("Transaction", back_populates="account")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    event_type = Column(String(100), default="BALANCE_INQUIRY", nullable=False)
    user_id = Column(Uuid, ForeignKey("users.id"), nullable=False)
    account_id = Column(Uuid, ForeignKey("accounts.id"), nullable=False)
    timestamp = Column(DateTime, default=func.now(), nullable=False)
    details = Column(Text, default=None, nullable=True)

    user = relationship("User", back_populates="audit_logs")
    account = relationship("Account", back_populates="audit_logs")

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    account_id = Column(Uuid, ForeignKey("accounts.id"), nullable=False)
    amount = Column(Numeric(15, 2), default=0.00, nullable=False)
    type = Column(String(50), nullable=False)
    description = Column(String(255), nullable=False)
    timestamp = Column(DateTime, default=func.now(), nullable=False)

    account = relationship("Account", back_populates="transactions")
