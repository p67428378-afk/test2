import uuid
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Text, Numeric
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

class Scenario(Base):
    __tablename__ = "scenarios"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    strategy_type = Column(String(50), nullable=False)
    projected_sales_lift = Column(Numeric(5, 2), default=0.0, nullable=False)
    private_brand_percentage = Column(Numeric(5, 2), default=0.0, nullable=False)
    in_stock_rate = Column(Numeric(5, 2), default=0.0, nullable=False)
    shelf_space_utilized = Column(Numeric(5, 2), default=0.0, nullable=False)
    is_submitted = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    sku_actions = relationship("ScenarioSKU", back_populates="scenario", cascade="all, delete-orphan")
    audits = relationship("ApprovalAudit", back_populates="scenario", cascade="all, delete-orphan")

class ScenarioSKU(Base):
    __tablename__ = "scenario_skus"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scenario_id = Column(UUID(as_uuid=True), ForeignKey("scenarios.id"), nullable=False)
    sku_id = Column(String(50), nullable=False)
    product_name = Column(String(255), nullable=False)
    brand = Column(String(255), nullable=False)
    action = Column(String(50), nullable=False)
    sales_impact = Column(Numeric(10, 2), default=0.0, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)

    scenario = relationship("Scenario", back_populates="sku_actions")

class ApprovalAudit(Base):
    __tablename__ = "approval_audits"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scenario_id = Column(UUID(as_uuid=True), ForeignKey("scenarios.id"), nullable=False)
    submitted_at = Column(DateTime, default=func.now(), nullable=False)
    submitted_by = Column(String(255), nullable=False)
    action = Column(String(255), nullable=False)
    status = Column(String(50), nullable=False)

    scenario = relationship("Scenario", back_populates="audits")
