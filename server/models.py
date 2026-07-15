import uuid
from sqlalchemy import (
    Column,
    String,
    DateTime,
    Boolean,
    ForeignKey,
    Numeric,
    Integer,
    JSON,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from server.database import Base


# Existing tables from password reset microservice
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


# New tables for DG Cluster Assortment Advisor
class SKU(Base):
    __tablename__ = "skus"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sku_number = Column(String(50), unique=True, nullable=False)
    product_name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    is_private_brand = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    performance = relationship(
        "SKUPerformance", back_populates="sku", cascade="all, delete-orphan"
    )
    scenarios = relationship(
        "AssortmentScenario", back_populates="sku", cascade="all, delete-orphan"
    )


class SKUPerformance(Base):
    __tablename__ = "sku_performance"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sku_id = Column(UUID(as_uuid=True), ForeignKey("skus.id"), nullable=False)
    sales = Column(Numeric(12, 2), nullable=False)
    units = Column(Integer, nullable=False)
    margin_percentage = Column(Numeric(5, 2), nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)

    sku = relationship("SKU", back_populates="performance")


class AssortmentScenario(Base):
    __tablename__ = "assortment_scenarios"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sku_id = Column(UUID(as_uuid=True), ForeignKey("skus.id"), nullable=False)
    scenario_name = Column(
        String(50), nullable=False
    )  # Conservative, Balanced, Aggressive
    action = Column(String(50), nullable=False)  # GROW, MAINTAIN, SWAP, REDUCE
    created_at = Column(DateTime, default=func.now(), nullable=False)

    sku = relationship("SKU", back_populates="scenarios")


class SubmissionLog(Base):
    __tablename__ = "submission_log"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String(100), nullable=False)
    submission_timestamp = Column(DateTime, default=func.now(), nullable=False)
    scenario_selected = Column(String(50), nullable=False)
    actions_payload = Column(JSON, nullable=False)
