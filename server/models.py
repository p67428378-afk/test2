import uuid
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Float, Integer
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


class Product(Base):
    __tablename__ = "products"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sku = Column(String(50), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    is_private_brand = Column(Boolean, default=False, nullable=False)

    performance_metrics = relationship("PerformanceMetric", back_populates="product")


class PerformanceMetric(Base):
    __tablename__ = "performance_metrics"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=False)
    sales = Column(Float, default=0.0, nullable=False)
    profit_margin = Column(Float, default=0.0, nullable=False)
    days_of_supply = Column(Integer, default=0, nullable=False)
    status_badge = Column(String(50), nullable=False)
    trend_direction = Column(
        String(50), default="Flat", nullable=False
    )  # Up, Down, Flat

    product = relationship("Product", back_populates="performance_metrics")


class AssortmentScenario(Base):
    __tablename__ = "assortment_scenarios"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(50), unique=True, nullable=False)
    projected_sales_lift = Column(Float, default=0.0, nullable=False)
    projected_private_brand_pct = Column(Float, default=0.0, nullable=False)

    audit_trails = relationship("AuditTrail", back_populates="scenario")


class AuditTrail(Base):
    __tablename__ = "audit_trail"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scenario_id = Column(
        UUID(as_uuid=True), ForeignKey("assortment_scenarios.id"), nullable=False
    )
    audit_id = Column(String(50), unique=True, nullable=False)
    submitted_at = Column(DateTime, default=func.now(), nullable=False)
    summary = Column(String(255), nullable=False)

    scenario = relationship("AssortmentScenario", back_populates="audit_trails")
