import uuid
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Numeric, Date
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from server.database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    # Original fields
    login_id = Column(String(255), unique=True, nullable=True)
    mobile_number = Column(String(20), unique=True, nullable=True)
    hashed_password = Column(String(255), nullable=True)
    security_question = Column(String(255), nullable=True)
    security_answer_hash = Column(String(255), nullable=True)

    # New fields
    email = Column(String(255), unique=True, nullable=False)
    is_roundup_enabled = Column(Boolean, default=False, nullable=False)

    created_at = Column(DateTime(timezone=True), default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True), default=func.now(), onupdate=func.now(), nullable=False
    )

    # Original relationships
    otps = relationship("OTP", back_populates="user", cascade="all, delete-orphan")
    password_history = relationship(
        "PasswordHistory", back_populates="user", cascade="all, delete-orphan"
    )

    # New relationships
    linked_accounts = relationship(
        "LinkedAccount", back_populates="user", cascade="all, delete-orphan"
    )
    transactions = relationship(
        "Transaction", back_populates="user", cascade="all, delete-orphan"
    )
    roundup_investments = relationship(
        "RoundupInvestment", back_populates="user", cascade="all, delete-orphan"
    )


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


class LinkedAccount(Base):
    __tablename__ = "linked_accounts"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    plaid_access_token = Column(String(255), nullable=False)
    account_name = Column(String(100), nullable=False)
    created_at = Column(DateTime(timezone=True), default=func.now(), nullable=False)

    user = relationship("User", back_populates="linked_accounts")
    transactions = relationship(
        "Transaction", back_populates="linked_account", cascade="all, delete-orphan"
    )


class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    linked_account_id = Column(
        UUID(as_uuid=True), ForeignKey("linked_accounts.id"), nullable=False
    )
    plaid_transaction_id = Column(String(255), unique=True, nullable=False)
    merchant_name = Column(String(255), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    roundup_amount = Column(Numeric(10, 2), nullable=False)
    transaction_date = Column(Date, nullable=False)
    status = Column(
        String(50), default="Pending", nullable=False
    )  # 'Pending', 'Invested', 'Skipped'
    created_at = Column(DateTime(timezone=True), default=func.now(), nullable=False)

    user = relationship("User", back_populates="transactions")
    linked_account = relationship("LinkedAccount", back_populates="transactions")


class RoundupInvestment(Base):
    __tablename__ = "roundup_investments"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    aggregated_amount = Column(Numeric(10, 2), nullable=False)
    investment_date = Column(Date, nullable=False)
    status = Column(
        String(50), default="Pending", nullable=False
    )  # 'Pending', 'Invested', 'Failed'
    created_at = Column(DateTime(timezone=True), default=func.now(), nullable=False)

    user = relationship("User", back_populates="roundup_investments")
