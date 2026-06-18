"""
Module: server/models.py
Purpose: Database models for Global Treasury Sweeping Rule Management
"""

import uuid
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Float, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from server.database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
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
    sweep_rules = relationship("SweepRule", back_populates="user")
    notification_logs = relationship("NotificationLog", back_populates="user")


class OTP(Base):
    __tablename__ = "otps"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    otp_code_hash = Column(String(255), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())

    user = relationship("User", back_populates="otps")


class PasswordHistory(Base):
    __tablename__ = "password_history"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    changed_at = Column(DateTime, default=func.now())

    user = relationship("User", back_populates="password_history")


class Account(Base):
    __tablename__ = "accounts"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    account_number = Column(String(255), unique=True, nullable=False)
    bank_name = Column(String(255), nullable=False)
    currency = Column(String(10), nullable=False)
    balance = Column(Float, default=0.0, nullable=False)
    country = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="accounts")


class SweepRule(Base):
    __tablename__ = "sweep_rules"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    name = Column(String(255), nullable=False)
    source_accounts = Column(JSON, nullable=False)
    target_account = Column(String(255), nullable=False)
    threshold = Column(Float, nullable=False)
    frequency = Column(String(50), nullable=False)
    fx_strategy = Column(String(50), nullable=False)
    status = Column(String(50), default="PENDING_APPROVAL", nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="sweep_rules")
    executions = relationship("SweepExecution", back_populates="rule")


class SweepExecution(Base):
    __tablename__ = "sweep_executions"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    rule_id = Column(String(36), ForeignKey("sweep_rules.id"), nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String(10), nullable=False)
    fx_rate = Column(Float, nullable=True)
    fx_strategy_used = Column(String(50), nullable=False)
    aml_status = Column(String(50), default="PENDING", nullable=False)
    status = Column(String(50), default="PENDING", nullable=False)
    error_reason = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    rule = relationship("SweepRule", back_populates="executions")


class NotificationLog(Base):
    __tablename__ = "notification_logs"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    type = Column(String(50), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(String, nullable=False)
    status = Column(String(50), default="SENT", nullable=False)
    created_at = Column(DateTime, default=func.now())

    user = relationship("User", back_populates="notification_logs")
