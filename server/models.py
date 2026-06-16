import uuid
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Integer, Numeric, DECIMAL
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

class SKU(Base):
    __tablename__ = "skus"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    weekly_sales = Column(Numeric(10, 2), nullable=False, default=0.00)
    profit_margin = Column(Numeric(5, 2), nullable=False, default=0.00)
    days_of_supply = Column(Integer, nullable=False, default=0)
    recommended_action = Column(String(50), nullable=False)

    decision_items = relationship("DecisionItem", back_populates="sku")

class AssortmentDecision(Base):
    __tablename__ = "assortment_decisions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    scenario_name = Column(String(50), nullable=False)
    submitted_by = Column(String(255), nullable=False)
    submitted_at = Column(DateTime, nullable=False, default=func.now())
    audit_id = Column(String(100), nullable=False, unique=True)

    items = relationship("DecisionItem", back_populates="decision", cascade="all, delete-orphan")

class DecisionItem(Base):
    __tablename__ = "decision_items"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    decision_id = Column(UUID(as_uuid=True), ForeignKey("assortment_decisions.id"), nullable=False)
    sku_id = Column(UUID(as_uuid=True), ForeignKey("skus.id"), nullable=False)
    action = Column(String(50), nullable=False)

    decision = relationship("AssortmentDecision", back_populates="items")
    sku = relationship("SKU", back_populates="decision_items")
