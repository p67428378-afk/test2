"""
Module: server/models.py
Purpose: Database models for password reset and assortment advisor.
Author: Backend Developer Agent
Created: 2026-06-09
"""

import uuid
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Float, Integer, Date
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

# --- Assortment Advisor Models ---

class Product(Base):
    __tablename__ = "products"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    sku = Column(String(255), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    category = Column(String(255), default="Snacks", nullable=False)
    is_private_brand = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    sku_performances = relationship("SKUPerformance", back_populates="product")

class KPIData(Base):
    __tablename__ = "kpi_data"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    date = Column(Date, nullable=False)
    kpi_name = Column(String(255), nullable=False)
    value = Column(Float, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)

class SKUPerformance(Base):
    __tablename__ = "sku_performance"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    product_id = Column(String(36), ForeignKey("products.id"), nullable=False)
    date = Column(Date, nullable=False)
    sales = Column(Float, nullable=False)
    units = Column(Integer, nullable=False)
    profit_margin = Column(Float, nullable=False)
    days_of_supply = Column(Integer, nullable=False)
    status_badge = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)

    product = relationship("Product", back_populates="sku_performances")

class Scenario(Base):
    __tablename__ = "scenarios"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    description = Column(String(1000), nullable=False)
    projected_sales_lift = Column(Float, nullable=False)
    projected_profit_margin = Column(Float, nullable=False)
    new_private_brand_percent = Column(Float, nullable=False)
    skus_to_add = Column(Integer, nullable=False)
    skus_to_remove = Column(Integer, nullable=False)
    skus_to_swap = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)

    submissions = relationship("AssortmentSubmission", back_populates="scenario")

class AssortmentSubmission(Base):
    __tablename__ = "assortment_submissions"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(255), nullable=False)
    submission_time = Column(DateTime, default=func.now(), nullable=False)
    scenario_id = Column(String(36), ForeignKey("scenarios.id"), nullable=False)
    status = Column(String(50), default="Submitted", nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)

    scenario = relationship("Scenario", back_populates="submissions")
