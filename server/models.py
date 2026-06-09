import uuid
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Integer, Double, Text
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

class SKU(Base):
    __tablename__ = "skus"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    brand = Column(String(255), nullable=False)
    is_private_brand = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    sales_data = relationship("SalesData", back_populates="sku")
    plan_skus = relationship("AssortmentPlanSKU", back_populates="sku")

class Store(Base):
    __tablename__ = "stores"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    cluster = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    sales_data = relationship("SalesData", back_populates="store")

class SalesData(Base):
    __tablename__ = "sales_data"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sku_id = Column(UUID(as_uuid=True), ForeignKey("skus.id"), nullable=False)
    store_id = Column(UUID(as_uuid=True), ForeignKey("stores.id"), nullable=False)
    date = Column(DateTime, nullable=False)
    revenue = Column(Double, default=0.0, nullable=False)
    profit = Column(Double, default=0.0, nullable=False)
    volume = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)

    sku = relationship("SKU", back_populates="sales_data")
    store = relationship("Store", back_populates="sales_data")

class Scenario(Base):
    __tablename__ = "scenarios"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), unique=True, nullable=False)
    description = Column(Text, nullable=False)
    projected_sales = Column(Double, default=0.0, nullable=False)
    projected_profit = Column(Double, default=0.0, nullable=False)
    projected_private_brand_pct = Column(Double, default=0.0, nullable=False)

    plans = relationship("AssortmentPlan", back_populates="scenario")

class AssortmentPlan(Base):
    __tablename__ = "assortment_plans"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scenario_id = Column(UUID(as_uuid=True), ForeignKey("scenarios.id"), nullable=False)
    status = Column(String(50), default="DRAFT", nullable=False)
    created_by = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    scenario = relationship("Scenario", back_populates="plans")
    plan_skus = relationship("AssortmentPlanSKU", back_populates="plan")
    audit_trails = relationship("AuditTrail", back_populates="plan")

class AssortmentPlanSKU(Base):
    __tablename__ = "assortment_plan_skus"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    plan_id = Column(UUID(as_uuid=True), ForeignKey("assortment_plans.id"), nullable=False)
    sku_id = Column(UUID(as_uuid=True), ForeignKey("skus.id"), nullable=False)
    action = Column(String(50), nullable=False)

    plan = relationship("AssortmentPlan", back_populates="plan_skus")
    sku = relationship("SKU", back_populates="plan_skus")

class AuditTrail(Base):
    __tablename__ = "audit_trails"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    plan_id = Column(UUID(as_uuid=True), ForeignKey("assortment_plans.id"), nullable=False)
    user_id = Column(String(255), nullable=False)
    timestamp = Column(DateTime, default=func.now(), nullable=False)
    action = Column(String(255), nullable=False)

    plan = relationship("AssortmentPlan", back_populates="audit_trails")
