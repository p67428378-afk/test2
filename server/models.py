import uuid
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Integer, Numeric
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
    product_name = Column(String(255), nullable=False)
    sku_code = Column(String(50), unique=True, nullable=False)
    is_private_brand = Column(Boolean, nullable=False, default=False)
    width_inches = Column(Numeric, nullable=False, default=0.0)
    facings = Column(Integer, nullable=False, default=1)

    performance_metrics = relationship(
        "SKUPerformance", back_populates="sku", uselist=False
    )
    submission_actions = relationship("SubmissionAction", back_populates="sku")


class SKUPerformance(Base):
    __tablename__ = "sku_performance_metrics"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sku_id = Column(UUID(as_uuid=True), ForeignKey("skus.id"), nullable=False)
    sales_revenue = Column(Numeric, nullable=False, default=0.0)
    units_sold = Column(Integer, nullable=False, default=0)
    profit_margin = Column(Numeric, nullable=False, default=0.0)
    days_of_supply = Column(Integer, nullable=False, default=0)
    in_stock_rate = Column(Numeric, nullable=False, default=100.0)
    status_badge = Column(String(20), nullable=False)

    sku = relationship("SKU", back_populates="performance_metrics")


class AssortmentSubmission(Base):
    __tablename__ = "assortment_submissions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    audit_trail_id = Column(
        UUID(as_uuid=True), unique=True, nullable=False, default=uuid.uuid4
    )
    scenario_name = Column(String(50), nullable=False)
    submitted_by = Column(String(255), nullable=False)
    submission_timestamp = Column(DateTime, nullable=False, default=func.now())

    actions = relationship("SubmissionAction", back_populates="submission")


class SubmissionAction(Base):
    __tablename__ = "submission_actions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    submission_id = Column(
        UUID(as_uuid=True), ForeignKey("assortment_submissions.id"), nullable=False
    )
    sku_id = Column(UUID(as_uuid=True), ForeignKey("skus.id"), nullable=False)
    action = Column(String(50), nullable=False)

    submission = relationship("AssortmentSubmission", back_populates="actions")
    sku = relationship("SKU", back_populates="submission_actions")
