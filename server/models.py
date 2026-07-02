import uuid
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Numeric, Integer
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


# --- Fixed Deposit Feature Models ---


class Customer(Base):
    __tablename__ = "customers"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    accounts = relationship("Account", back_populates="customer")


class Account(Base):
    __tablename__ = "accounts"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    customer_id = Column(String(36), ForeignKey("customers.id"), nullable=False)
    account_number = Column(String(255), unique=True, nullable=False)
    balance = Column(Numeric(15, 2), nullable=False, default=0.00)
    currency = Column(String(10), nullable=False, default="USD")
    account_type = Column(
        String(50), nullable=False, default="SAVINGS"
    )  # SAVINGS or FD
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    customer = relationship("Customer", back_populates="accounts")
    transactions = relationship("Transaction", back_populates="account")


class FDProduct(Base):
    __tablename__ = "fd_products"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    tenure_months = Column(Integer, nullable=False)
    interest_rate = Column(Numeric(5, 2), nullable=False)
    min_deposit = Column(Numeric(15, 2), nullable=False, default=1000.00)
    badge = Column(String(100), nullable=True)


class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    account_id = Column(String(36), ForeignKey("accounts.id"), nullable=False)
    amount = Column(Numeric(15, 2), nullable=False)
    transaction_type = Column(String(50), nullable=False)  # DEPOSIT, WITHDRAWAL, etc.
    status = Column(
        String(50), nullable=False, default="PENDING"
    )  # PENDING, COMPLETED, FAILED
    created_at = Column(DateTime, default=func.now())

    account = relationship("Account", back_populates="transactions")
