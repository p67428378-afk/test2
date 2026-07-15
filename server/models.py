import uuid
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey
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


# --- DG Cluster Assortment Advisor Models ---


class AssortmentPlan(Base):
    __tablename__ = "assortment_plans"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scenario_name = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    submitted_by = Column(String(255), nullable=False)
    audit_trail_id = Column(String(50), nullable=False)
    guardrail_status = Column(
        String, nullable=False
    )  # Stored as JSON string for SQLite compatibility

    sku_actions = relationship(
        "PlanSKUAction", back_populates="assortment_plan", cascade="all, delete-orphan"
    )


class PlanSKUAction(Base):
    __tablename__ = "plan_sku_actions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    assortment_plan_id = Column(
        UUID(as_uuid=True), ForeignKey("assortment_plans.id"), nullable=False
    )
    sku = Column(String(255), nullable=False)
    action = Column(String(50), nullable=False)

    assortment_plan = relationship("AssortmentPlan", back_populates="sku_actions")
