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

class SKUPerformance(Base):
    __tablename__ = "sku_performance"
    sku_id = Column(String(255), primary_key=True)
    name = Column(String(255), nullable=False)
    sales = Column(Numeric, nullable=False)
    profit_margin = Column(Numeric, nullable=False)
    units_sold = Column(Integer, nullable=False)
    status_badge = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class Scenario(Base):
    __tablename__ = "scenario"
    scenario_id = Column(String(255), primary_key=True)
    name = Column(String(255), unique=True, nullable=False)
    description = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    actions = relationship("ScenarioAction", back_populates="scenario")
    submissions = relationship("AssortmentSubmission", back_populates="scenario")

class ScenarioAction(Base):
    __tablename__ = "scenario_action"
    action_id = Column(String(255), primary_key=True)
    scenario_id = Column(String(255), ForeignKey("scenario.scenario_id"), nullable=False)
    sku_id = Column(String(255), ForeignKey("sku_performance.sku_id"), nullable=False)
    action_type = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    scenario = relationship("Scenario", back_populates="actions")
    sku = relationship("SKUPerformance")

class AssortmentSubmission(Base):
    __tablename__ = "assortment_submission"
    submission_id = Column(String(255), primary_key=True)
    user_id = Column(String(255), nullable=False)
    timestamp = Column(DateTime, default=func.now())
    scenario_id = Column(String(255), ForeignKey("scenario.scenario_id"), nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    scenario = relationship("Scenario", back_populates="submissions")
    details = relationship("SubmissionDetails", back_populates="submission")

class SubmissionDetails(Base):
    __tablename__ = "submission_details"
    submission_detail_id = Column(String(255), primary_key=True)
    submission_id = Column(String(255), ForeignKey("assortment_submission.submission_id"), nullable=False)
    sku_id = Column(String(255), ForeignKey("sku_performance.sku_id"), nullable=False)
    action_taken = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    submission = relationship("AssortmentSubmission", back_populates="details")
    sku = relationship("SKUPerformance")
