import uuid
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Float, Date
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


class Customer(Base):
    __tablename__ = "customers"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    first_name = Column(String(255), nullable=False)
    last_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    phone = Column(String(20), nullable=False)
    date_of_birth = Column(Date, nullable=False)
    address = Column(String(255), nullable=False)
    aadhaar_number = Column(String(20), nullable=True)
    pan_number = Column(String(20), nullable=True)
    status = Column(String(50), nullable=False, default="REVIEW")
    risk_score = Column(Float, nullable=False, default=0.0)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    verifications = relationship("VerificationCheck", back_populates="customer")
    screening_results = relationship("ScreeningResult", back_populates="customer")
    transactions = relationship("Transaction", back_populates="customer")
    alerts = relationship("Alert", back_populates="customer")
    reports = relationship("Report", back_populates="customer")
    audit_logs = relationship("AuditLog", back_populates="customer")


class VerificationCheck(Base):
    __tablename__ = "verification_checks"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id"), nullable=False)
    check_type = Column(String(50), nullable=False)
    status = Column(String(50), nullable=False, default="PENDING")
    details = Column(String(1000), nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    customer = relationship("Customer", back_populates="verifications")


class ScreeningResult(Base):
    __tablename__ = "screening_results"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id"), nullable=False)
    watchlist = Column(String(100), nullable=False)
    match_status = Column(String(50), nullable=False)
    confidence_score = Column(Float, nullable=False, default=0.0)
    reason = Column(String(1000), nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)

    customer = relationship("Customer", back_populates="screening_results")


class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id"), nullable=False)
    amount = Column(Float, nullable=False)
    transaction_type = Column(String(50), nullable=False)
    destination_account = Column(String(100), nullable=True)
    status = Column(String(50), nullable=False, default="COMPLETED")
    created_at = Column(DateTime, default=func.now(), nullable=False)

    customer = relationship("Customer", back_populates="transactions")


class Alert(Base):
    __tablename__ = "alerts"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id"), nullable=False)
    triggered_rule = Column(String(100), nullable=False)
    total_amount = Column(Float, nullable=False)
    severity = Column(String(50), nullable=False)
    status = Column(String(50), nullable=False, default="OPEN")
    notes = Column(String(1000), nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    customer = relationship("Customer", back_populates="alerts")


class Report(Base):
    __tablename__ = "reports"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id"), nullable=True)
    report_type = Column(String(50), nullable=False)
    xml_content = Column(String(10000), nullable=False)
    status = Column(String(50), nullable=False, default="PENDING")
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    customer = relationship("Customer", back_populates="reports")


class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id"), nullable=True)
    action = Column(String(100), nullable=False)
    performed_by = Column(String(100), nullable=False)
    details = Column(String(1000), nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)

    customer = relationship("Customer", back_populates="audit_logs")
