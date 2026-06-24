import uuid
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Numeric, Text
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


# --- New Models for Retail Banking Product Decision-Support Dashboard ---


class Product(Base):
    __tablename__ = "products"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), unique=True, nullable=False)
    category = Column(String(50), nullable=False)
    aum_contribution = Column(Numeric(15, 2), default=0.00, nullable=False)
    npa_percentage = Column(Numeric(5, 2), default=None, nullable=True)
    status = Column(String(20), default="MAINTAIN", nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    actions = relationship("ScenarioProductAction", back_populates="product")


class Scenario(Base):
    __tablename__ = "scenarios"
    id = Column(String(50), primary_key=True, nullable=False)
    name = Column(String(50), nullable=False)
    description = Column(Text, nullable=False)
    casa_growth = Column(Numeric(5, 2), default=0.00, nullable=False)
    npa_risk = Column(String(20), nullable=False)
    roa_impact = Column(Numeric(5, 2), default=0.00, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    product_actions = relationship("ScenarioProductAction", back_populates="scenario")
    proposals = relationship("Proposal", back_populates="scenario")


class ScenarioProductAction(Base):
    __tablename__ = "scenario_product_actions"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    scenario_id = Column(String(50), ForeignKey("scenarios.id"), nullable=False)
    product_id = Column(String(36), ForeignKey("products.id"), nullable=False)
    action = Column(String(20), nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    scenario = relationship("Scenario", back_populates="product_actions")
    product = relationship("Product", back_populates="actions")


class Proposal(Base):
    __tablename__ = "proposals"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    scenario_id = Column(String(50), ForeignKey("scenarios.id"), nullable=False)
    status = Column(String(20), default="SUBMITTED", nullable=False)
    submitted_by = Column(String(100), nullable=False)
    routed_to = Column(String(100), nullable=False)
    timestamp = Column(DateTime, default=func.now(), nullable=False)
    guardrails_passed = Column(Boolean, default=True, nullable=False)
    audit_trail = Column(Text, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    scenario = relationship("Scenario", back_populates="proposals")
