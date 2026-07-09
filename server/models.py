import uuid
from sqlalchemy import (
    Column,
    String,
    DateTime,
    Boolean,
    ForeignKey,
    Numeric,
    Text,
    Integer,
    Float,
)
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


class Product(Base):
    __tablename__ = "products"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    sku_name = Column(String(255), nullable=False)
    upc = Column(String(50), unique=True, nullable=False)
    is_private_brand = Column(Boolean, default=False, nullable=False)
    linear_shelf_footprint = Column(Numeric(5, 2), default=1.0, nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    performance_metrics = relationship(
        "PerformanceMetric", back_populates="product", cascade="all, delete-orphan"
    )


class PerformanceMetric(Base):
    __tablename__ = "performance_metrics"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    product_id = Column(String(36), ForeignKey("products.id"), nullable=False)
    weekly_sales = Column(Numeric(10, 2), nullable=False)
    profit_margin = Column(Numeric(5, 2), nullable=False)
    stock_level = Column(Integer, nullable=False)
    days_of_supply = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    product = relationship("Product", back_populates="performance_metrics")


class ProductPerformance(Base):
    __tablename__ = "productperformance"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    sku_name = Column(String(255), nullable=False)
    upc = Column(String(12), unique=True, nullable=False)
    weekly_sales = Column(Float, default=0.0, nullable=False)
    profit_margin = Column(Float, default=0.0, nullable=False)
    stock_level = Column(Integer, default=0, nullable=False)
    days_of_supply = Column(Integer, default=0, nullable=False)
    is_private_brand = Column(Boolean, default=False, nullable=False)
    linear_feet = Column(Float, default=1.0, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )


class AssortmentScenario(Base):
    __tablename__ = "assortment_scenarios"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(50), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    projected_sales_impact_pct = Column(Numeric(5, 2), nullable=False)
    projected_private_brand_pct = Column(Numeric(5, 2), nullable=False)
    projected_shelf_capacity_pct = Column(Numeric(5, 2), nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())


class AuditTrail(Base):
    __tablename__ = "audit_trail"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    confirmation_id = Column(String(36), unique=True, nullable=False)
    scenario_applied = Column(String(50), nullable=False)
    user_name = Column(String(100), nullable=False)
    added_count = Column(Integer, nullable=False)
    removed_count = Column(Integer, nullable=False)
    swapped_count = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=func.now())


class ScenarioSubmission(Base):
    __tablename__ = "scenario_submissions"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    confirmation_id = Column(String(36), unique=True, nullable=False)
    submitted_at = Column(DateTime, default=func.now(), nullable=False)
    user_id = Column(String(255), nullable=False)
    scenario_applied = Column(String(50), nullable=False)
    changes_summary = Column(Text, nullable=False)  # JSON string or text representation
