import uuid
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from server.database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    login_id = Column(
        String(255), unique=True, nullable=True
    )  # Keep for compatibility with password reset
    mobile_number = Column(
        String(20), unique=True, nullable=True
    )  # Keep for compatibility with password reset
    hashed_password = Column(
        String(255), nullable=True
    )  # Keep for compatibility with password reset
    security_question = Column(
        String(255), nullable=True
    )  # Keep for compatibility with password reset
    security_answer_hash = Column(
        String(255), nullable=True
    )  # Keep for compatibility with password reset

    # New fields for SCRUM-473
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    phone_number = Column(String(50), unique=True, nullable=False)
    encrypted_ssn = Column(String(500), nullable=False)
    date_of_birth = Column(String(50), nullable=False)  # Store as string YYYY-MM-DD
    password_hash = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=False, nullable=False)
    failed_login_attempts = Column(Integer, default=0, nullable=False)
    lockout_until = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True), default=func.now(), onupdate=func.now(), nullable=False
    )

    otps = relationship("OTP", back_populates="user")
    password_history = relationship("PasswordHistory", back_populates="user")
    two_fa_methods = relationship("User2FAMethod", back_populates="user")
    audit_logs = relationship("AuditLog", back_populates="user")


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


class User2FAMethod(Base):
    __tablename__ = "user_2fa_methods"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    method_type = Column(String(50), nullable=False)  # 'SMS' or 'APP'
    secret = Column(String(500), nullable=False)  # Encrypted or plain secret
    is_verified = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), default=func.now(), nullable=False)

    user = relationship("User", back_populates="two_fa_methods")


class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    event_type = Column(String(100), nullable=False)
    ip_address = Column(String(50), nullable=False)
    timestamp = Column(DateTime(timezone=True), default=func.now(), nullable=False)

    user = relationship("User", back_populates="audit_logs")
