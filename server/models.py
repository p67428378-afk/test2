import uuid
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Float, Text
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
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True)
    sku = Column(String(50), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    brand = Column(String(255), nullable=False)
    sub_category = Column(String(255), nullable=False)
    is_private_brand = Column(Boolean, nullable=False, default=False)

    sales_metrics = relationship(
        "SalesMetrics", back_populates="product", uselist=False
    )


class SalesMetrics(Base):
    __tablename__ = "sales_metrics"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True)
    product_id = Column(
        UUID(as_uuid=True), ForeignKey("products.id"), unique=True, nullable=False
    )
    sales_velocity = Column(Float, nullable=False, default=0.0)
    sales_trend = Column(Float, nullable=False, default=0.0)
    in_stock_rate = Column(Float, nullable=False, default=100.0)
    shelf_capacity_utilized = Column(Float, nullable=False, default=0.0)

    product = relationship("Product", back_populates="sales_metrics")


class AssortmentAudit(Base):
    __tablename__ = "assortment_audits"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True)
    audit_trail_id = Column(String(50), unique=True, nullable=False)
    scenario_name = Column(String(50), nullable=False)
    actions_json = Column(Text, nullable=False)
    created_at = Column(DateTime, nullable=False, default=func.now())
