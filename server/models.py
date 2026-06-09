import uuid
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Numeric, JSON, Text
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

class SKU(Base):
    __tablename__ = "skus"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sku_number = Column(String(50), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    category = Column(String(100), default="Snacks", nullable=False)
    private_brand = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    performance = relationship("SKUPerformance", back_populates="sku", uselist=False)

class SKUPerformance(Base):
    __tablename__ = "sku_performance"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sku_id = Column(UUID(as_uuid=True), ForeignKey("skus.id"), nullable=False)
    sales_per_week = Column(Numeric(10, 2), default=0.00, nullable=False)
    in_stock_rate = Column(Numeric(5, 2), default=100.00, nullable=False)
    shelf_capacity_used = Column(Numeric(5, 2), default=0.00, nullable=False)
    status_badge = Column(String(50), default="MAINTAIN", nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    sku = relationship("SKU", back_populates="performance")

class AssortmentReview(Base):
    __tablename__ = "assortment_reviews"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scenario = Column(String(50), nullable=False)
    audit_id = Column(String(50), unique=True, nullable=False)
    actions_summary = Column(Text, nullable=False)
    submitted_at = Column(DateTime, default=func.now(), nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
