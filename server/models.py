import uuid
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Numeric, Integer, JSON
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
    sku_name = Column(String(255), unique=True, nullable=False)
    current_sales = Column(Numeric, default=0.0, nullable=False)
    sales_per_linear_ft = Column(Numeric, default=0.0, nullable=False)
    private_brand = Column(Boolean, default=False, nullable=False)
    in_stock_rate = Column(Numeric, default=0.0, nullable=False)
    shelf_capacity = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

class Decision(Base):
    __tablename__ = "decisions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scenario_name = Column(String(50), nullable=False)
    decisions_payload = Column(JSON, nullable=False)
    submitted_by = Column(String(255), nullable=False)
    submitted_at = Column(DateTime, default=func.now(), nullable=False)
