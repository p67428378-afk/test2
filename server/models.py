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


# --- Product Strategy Decision-Support Tool Models ---


class Product(Base):
    __tablename__ = "products"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    aum_contribution = Column(Numeric(10, 2), nullable=False)
    npa_percentage = Column(Numeric(5, 2), nullable=False)
    status = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )


class Scenario(Base):
    __tablename__ = "scenarios"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    casa_growth_projection = Column(Numeric(5, 2), nullable=False)
    npa_risk_projection = Column(String(50), nullable=False)
    roa_impact_projection = Column(Numeric(5, 2), nullable=False)
    product_actions = Column(JSON, nullable=False)
    guardrails = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    approval_requests = relationship("ApprovalRequest", back_populates="scenario")


class ApprovalRequest(Base):
    __tablename__ = "approval_requests"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    scenario_id = Column(String(36), ForeignKey("scenarios.id"), nullable=False)
    user_id = Column(String(100), nullable=False)
    user_name = Column(String(255), nullable=False)
    submission_timestamp = Column(DateTime, nullable=False)
    status = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    scenario = relationship("Scenario", back_populates="approval_requests")
    audit_trail = relationship(
        "AuditTrail", back_populates="approval_request", uselist=False
    )


class AuditTrail(Base):
    __tablename__ = "audit_trails"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    request_id = Column(String(36), ForeignKey("approval_requests.id"), nullable=False)
    approved_by = Column(String(255), nullable=False)
    guardrails_passed = Column(JSON, nullable=False)
    timestamp = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)

    approval_request = relationship("ApprovalRequest", back_populates="audit_trail")
