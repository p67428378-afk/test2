import uuid
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Integer, Numeric
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


# --- DG Cluster Assortment Advisor Tables ---


class Product(Base):
    __tablename__ = "products"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sku = Column(String(50), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    sales_ytd = Column(Numeric(12, 2), nullable=False, default=0.00)
    units = Column(Integer, nullable=False, default=0)
    gm_pct = Column(Numeric(5, 2), nullable=False, default=0.00)
    recommendation = Column(String(50), nullable=False)
    is_private_brand = Column(Boolean, nullable=False, default=False)
    brand = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )


class KPIData(Base):
    __tablename__ = "kpi_data"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sales_per_linear_ft = Column(Numeric(10, 2), nullable=False)
    private_brand_pct = Column(Numeric(5, 2), nullable=False)
    in_stock_rate = Column(Numeric(5, 2), nullable=False)
    shelf_capacity = Column(Numeric(5, 2), nullable=False)
    sales_trend_pct = Column(Numeric(5, 2), nullable=False)
    private_brand_target = Column(Numeric(5, 2), nullable=False)
    in_stock_target = Column(Numeric(5, 2), nullable=False)
    shelf_capacity_range_min = Column(Numeric(5, 2), nullable=False)
    shelf_capacity_range_max = Column(Numeric(5, 2), nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )


class AssortmentPlan(Base):
    __tablename__ = "assortment_plans"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    selected_scenario = Column(String(50), nullable=False)
    audit_id = Column(String(100), unique=True, nullable=False)
    manager_name = Column(String(255), nullable=False)
    submitted_at = Column(DateTime, default=func.now(), nullable=False)

    sku_actions = relationship("PlanSKUAction", back_populates="plan")


class PlanSKUAction(Base):
    __tablename__ = "plan_sku_actions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    plan_id = Column(
        UUID(as_uuid=True), ForeignKey("assortment_plans.id"), nullable=False
    )
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=False)
    action = Column(String(50), nullable=False)

    plan = relationship("AssortmentPlan", back_populates="sku_actions")
    product = relationship("Product")
