import uuid
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Numeric, JSON
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
    product_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        nullable=False,
    )
    name = Column(String(255), nullable=False)
    category = Column(String(255), nullable=False)
    aum_contribution = Column(Numeric(15, 2), nullable=False, default=0.00)
    npa_percentage = Column(Numeric(5, 2), nullable=False, default=0.00)
    status = Column(String(50), nullable=False, default="GROW")
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(
        DateTime, nullable=False, default=func.now(), onupdate=func.now()
    )


class DecisionLog(Base):
    __tablename__ = "decision_logs"
    log_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        nullable=False,
    )
    user_id = Column(String(255), nullable=False)
    scenario_name = Column(String(50), nullable=False)
    submission_timestamp = Column(DateTime, nullable=False, default=func.now())
    guardrails_passed = Column(JSON, nullable=False, default=dict)

    products = relationship("DecisionProduct", back_populates="decision_log")


class DecisionProduct(Base):
    __tablename__ = "decision_products"
    decision_product_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        nullable=False,
    )
    log_id = Column(
        UUID(as_uuid=True), ForeignKey("decision_logs.log_id"), nullable=False
    )
    product_id = Column(
        UUID(as_uuid=True), ForeignKey("products.product_id"), nullable=False
    )
    recommended_action = Column(String(50), nullable=False)

    decision_log = relationship("DecisionLog", back_populates="products")
    product = relationship("Product")
