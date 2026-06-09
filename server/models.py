import uuid
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Integer, Text
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

class Review(Base):
    __tablename__ = "reviews"
    review_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    pr_id = Column(String(255), nullable=False)
    repo_name = Column(String(255), nullable=False)
    status = Column(String(50), default="PENDING", nullable=False)
    title = Column(String(255), nullable=True)
    branch_name = Column(String(255), nullable=True)
    scan_duration_seconds = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    issues = relationship("Issue", back_populates="review", cascade="all, delete-orphan")

class Issue(Base):
    __tablename__ = "issues"
    issue_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    review_id = Column(UUID(as_uuid=True), ForeignKey("reviews.review_id"), nullable=False)
    file_path = Column(String(1024), nullable=False)
    line_number = Column(Integer, nullable=False)
    message = Column(Text, nullable=False)
    severity = Column(String(50), default="INFO", nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)

    review = relationship("Review", back_populates="issues")

class CodeReviewConfig(Base):
    __tablename__ = "codereview_configs"
    id = Column(Integer, primary_key=True, index=True)
    pep8_enabled = Column(Boolean, default=True, nullable=False)
    max_line_length = Column(Integer, default=120, nullable=False)
    owasp_top_10 = Column(Boolean, default=True, nullable=False)
