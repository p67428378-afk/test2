import uuid
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Numeric, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from server.database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    login_id = Column(String(255), unique=True, nullable=False)
    mobile_number = Column(String(20), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    security_question = Column(String(255), nullable=False)
    security_answer_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    otps = relationship("OTP", back_populates="user")
    password_history = relationship("PasswordHistory", back_populates="user")


class OTP(Base):
    __tablename__ = "otps"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    otp_code_hash = Column(String(255), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())

    user = relationship("User", back_populates="otps")


class PasswordHistory(Base):
    __tablename__ = "password_history"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    changed_at = Column(DateTime, default=func.now())

    user = relationship("User", back_populates="password_history")


class Account(Base):
    __tablename__ = "accounts"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    account_number = Column(String(50), unique=True, nullable=False)
    currency = Column(String(3), nullable=False)
    balance = Column(Numeric(18, 2), nullable=False, default=0.00)
    bank_provider = Column(String(100), nullable=False)
    is_hub = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    source_sweep_rules = relationship(
        "SweepRule",
        foreign_keys="[SweepRule.source_account_id]",
        back_populates="source_account",
    )
    hub_sweep_rules = relationship(
        "SweepRule",
        foreign_keys="[SweepRule.hub_account_id]",
        back_populates="hub_account",
    )


class SweepRule(Base):
    __tablename__ = "sweep_rules"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    source_account_id = Column(
        UUID(as_uuid=True), ForeignKey("accounts.id"), nullable=False
    )
    hub_account_id = Column(
        UUID(as_uuid=True), ForeignKey("accounts.id"), nullable=False
    )
    target_balance = Column(Numeric(18, 2), nullable=False)
    sweep_threshold = Column(Numeric(18, 2), nullable=False)
    schedule = Column(String(100), nullable=False)
    status = Column(String(20), nullable=False, default="ACTIVE")
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    source_account = relationship(
        "Account", foreign_keys=[source_account_id], back_populates="source_sweep_rules"
    )
    hub_account = relationship(
        "Account", foreign_keys=[hub_account_id], back_populates="hub_sweep_rules"
    )
    activity_logs = relationship("ActivityLog", back_populates="sweep_rule")


class HedgeRule(Base):
    __tablename__ = "hedge_rules"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    currency_pair = Column(String(7), nullable=False)
    amount_threshold = Column(Numeric(18, 2), nullable=False)
    volatility_threshold = Column(Numeric(5, 2), nullable=True, default=None)
    status = Column(String(20), nullable=False, default="ACTIVE")
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    activity_logs = relationship("ActivityLog", back_populates="hedge_rule")


class ActivityLog(Base):
    __tablename__ = "activity_log"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    transaction_id = Column(UUID(as_uuid=True), nullable=False, default=uuid.uuid4)
    sweep_rule_id = Column(
        UUID(as_uuid=True), ForeignKey("sweep_rules.id"), nullable=True, default=None
    )
    hedge_rule_id = Column(
        UUID(as_uuid=True), ForeignKey("hedge_rules.id"), nullable=True, default=None
    )
    type = Column(String(50), nullable=False)
    status = Column(String(20), nullable=False)
    amount = Column(Numeric(18, 2), nullable=True, default=None)
    currency = Column(String(3), nullable=True, default=None)
    fx_rate = Column(Numeric(12, 6), nullable=True, default=None)
    converted_amount_usd = Column(Numeric(18, 2), nullable=True, default=None)
    details = Column(JSON, nullable=True, default=None)
    created_at = Column(DateTime, default=func.now())

    sweep_rule = relationship("SweepRule", back_populates="activity_logs")
    hedge_rule = relationship("HedgeRule", back_populates="activity_logs")
