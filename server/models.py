import uuid
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Integer, Numeric, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from server.database import Base

# Existing Password Reset Models
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


# New Assortment Advisor Models (using String(36) for UUIDs to ensure SQLite compatibility)
class SKU(Base):
    __tablename__ = "sku"
    sku_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), unique=True)
    name = Column(String(255), nullable=False)
    description = Column(String, nullable=True)
    brand = Column(String(255), nullable=True)
    sales = Column(Numeric(12, 2), nullable=False, default=0.00)
    units = Column(Integer, nullable=False, default=0)
    profit = Column(Numeric(12, 2), nullable=False, default=0.00)
    gm_pct = Column(Numeric(5, 2), nullable=False, default=0.00)
    status_badge = Column(String(50), nullable=False, default='MAINTAIN')
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(DateTime, nullable=False, default=func.now(), onupdate=func.now())

    assortment_changes = relationship("AssortmentChange", back_populates="sku")

class Scenario(Base):
    __tablename__ = "scenario"
    scenario_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), unique=True)
    name = Column(String(255), nullable=False)
    projected_sales = Column(Numeric(12, 2), nullable=False, default=0.00)
    change_in_private_brand_pct = Column(Numeric(5, 2), nullable=False, default=0.00)
    shelf_utilization_pct = Column(Numeric(5, 2), nullable=False, default=0.00)
    is_selected = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(DateTime, nullable=False, default=func.now(), onupdate=func.now())

    assortment_changes = relationship("AssortmentChange", back_populates="scenario")
    audit_trails = relationship("AuditTrail", back_populates="scenario")

class AssortmentChange(Base):
    __tablename__ = "assortment_change"
    change_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), unique=True)
    scenario_id = Column(String(36), ForeignKey("scenario.scenario_id"), nullable=False)
    sku_id = Column(String(36), ForeignKey("sku.sku_id"), nullable=False)
    action = Column(String(50), nullable=False)
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(DateTime, nullable=False, default=func.now(), onupdate=func.now())

    scenario = relationship("Scenario", back_populates="assortment_changes")
    sku = relationship("SKU", back_populates="assortment_changes")

class AuditTrail(Base):
    __tablename__ = "audit_trail"
    audit_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), unique=True)
    scenario_id = Column(String(36), ForeignKey("scenario.scenario_id"), nullable=False)
    user_id = Column(String(255), nullable=False)
    timestamp = Column(DateTime, nullable=False, default=func.now())
    summary = Column(JSON, nullable=False, default=dict)
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(DateTime, nullable=False, default=func.now(), onupdate=func.now())

    scenario = relationship("Scenario", back_populates="audit_trails")
