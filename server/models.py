import uuid
from sqlalchemy import (
    Column,
    String,
    DateTime,
    Boolean,
    ForeignKey,
    Float,
    Numeric,
    Date,
    JSON,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from server.database import Base


# Existing models
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


# New models for Assortment Advisor
class Product(Base):
    __tablename__ = "products"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    upc = Column(String(255), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    is_private_brand = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    performance_metrics = relationship(
        "PerformanceMetric", back_populates="product", cascade="all, delete-orphan"
    )


class PerformanceMetric(Base):
    __tablename__ = "performance_metrics"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=False)
    week_ending_date = Column(Date, nullable=False)
    weekly_sales = Column(Numeric(12, 2), nullable=False)
    sales_rank_percentile = Column(Float, nullable=False)
    margin_percentage = Column(Float, nullable=False)
    in_stock_rate = Column(Float, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)

    product = relationship("Product", back_populates="performance_metrics")


class AssortmentDecision(Base):
    __tablename__ = "assortment_decisions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scenario_name = Column(String(50), nullable=False)
    decision_payload = Column(JSON, nullable=False)
    submitted_by = Column(String(255), nullable=False)
    submitted_at = Column(DateTime, default=func.now(), nullable=False)
