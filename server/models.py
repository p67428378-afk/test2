"""
Module: server.models
Purpose: Database models for the Password Reset and Portfolio Optimizer services.
Author: Backend Developer Agent
Created: 2026-06-24
"""

import uuid
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from server.database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
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
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    otp_code_hash = Column(String(255), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())

    user = relationship("User", back_populates="otps")


class PasswordHistory(Base):
    __tablename__ = "password_history"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    changed_at = Column(DateTime, default=func.now())

    user = relationship("User", back_populates="password_history")


class Product(Base):
    __tablename__ = "products"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), unique=True, nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    metrics = relationship(
        "ProductMetric", back_populates="product", cascade="all, delete-orphan"
    )


class ProductMetric(Base):
    __tablename__ = "product_metrics"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    product_id = Column(String(36), ForeignKey("products.id"), nullable=False)
    aum_contribution = Column(Numeric, nullable=False)
    npa_percentage = Column(Numeric, nullable=False)
    status = Column(String(50), nullable=False)  # GROW, MAINTAIN, SWAP, REDUCE
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    product = relationship("Product", back_populates="metrics")


class Scenario(Base):
    __tablename__ = "scenarios"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(
        String(255), unique=True, nullable=False
    )  # Conservative, Balanced, Aggressive
    casa_growth = Column(String(255), nullable=False)
    npa_risk_movement = Column(String(255), nullable=False)
    roa_impact = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    decision_audits = relationship("DecisionAudit", back_populates="scenario")


class DecisionAudit(Base):
    __tablename__ = "decision_audits"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    scenario_id = Column(String(36), ForeignKey("scenarios.id"), nullable=False)
    approver_name = Column(String(255), nullable=False)
    timestamp = Column(DateTime, default=func.now())
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    scenario = relationship("Scenario", back_populates="decision_audits")
    guardrail_check = relationship(
        "GuardrailCheck",
        back_populates="decision",
        uselist=False,
        cascade="all, delete-orphan",
    )


class GuardrailCheck(Base):
    __tablename__ = "guardrail_checks"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    decision_id = Column(String(36), ForeignKey("decision_audits.id"), nullable=False)
    rbi_exposure_norms = Column(String(50), nullable=False)  # PASS, FAIL
    kyc_aml_flags = Column(String(50), nullable=False)  # PASS, FAIL
    pmla_2002_screening = Column(String(50), nullable=False)  # PASS, FAIL
    minimum_casa_floor = Column(String(50), nullable=False)  # PASS, FAIL
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    decision = relationship("DecisionAudit", back_populates="guardrail_check")
