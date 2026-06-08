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

# --- DG Cluster Assortment Advisor Models ---

class Product(Base):
    __tablename__ = "products"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sku_number = Column(String(255), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    brand = Column(String(255), nullable=False)
    category = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    metrics = relationship("ProductMetric", back_populates="product", cascade="all, delete-orphan")

class ProductMetric(Base):
    __tablename__ = "product_metrics"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=False)
    current_sales = Column(Numeric, default=0.0, nullable=False)
    sales_per_linear_ft = Column(Numeric, default=0.0, nullable=False)
    in_stock_rate = Column(Numeric, default=0.0, nullable=False)
    recommendation_status = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    product = relationship("Product", back_populates="metrics")

class Scenario(Base):
    __tablename__ = "scenarios"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), unique=True, nullable=False)
    description = Column(String(255), nullable=False)
    projected_sales_growth = Column(Numeric, default=0.0, nullable=False)
    projected_private_brand_pct = Column(Numeric, default=0.0, nullable=False)
    projected_shelf_capacity = Column(Numeric, default=0.0, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    decisions = relationship("AssortmentDecision", back_populates="scenario")

class AssortmentDecision(Base):
    __tablename__ = "assortment_decisions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scenario_id = Column(UUID(as_uuid=True), ForeignKey("scenarios.id"), nullable=True)
    approved_by = Column(String(255), nullable=False)
    approved_at = Column(DateTime, default=func.now(), nullable=False)
    transaction_id = Column(String(255), unique=True, nullable=False)
    summary = Column(JSON, default=dict, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    scenario = relationship("Scenario", back_populates="decisions")
