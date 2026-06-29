import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    DateTime,
    Boolean,
    ForeignKey,
    Integer,
    Float,
    Date,
)
from sqlalchemy.orm import relationship
from server.database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Existing fields for password reset microservice (made nullable)
    login_id = Column(String(255), unique=True, nullable=True)
    mobile_number = Column(String(20), unique=True, nullable=True)
    hashed_password = Column(String(255), nullable=True)
    security_question = Column(String(255), nullable=True)
    security_answer_hash = Column(String(255), nullable=True)

    otps = relationship("OTP", back_populates="user", cascade="all, delete-orphan")
    password_history = relationship(
        "PasswordHistory", back_populates="user", cascade="all, delete-orphan"
    )
    memberships = relationship(
        "Membership", back_populates="user", cascade="all, delete-orphan"
    )
    notification_settings = relationship(
        "NotificationSettings",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )


class OTP(Base):
    __tablename__ = "otps"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    otp_code_hash = Column(String(255), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="otps")


class PasswordHistory(Base):
    __tablename__ = "password_history"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    hashed_password = Column(String(255), nullable=False)
    changed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="password_history")


class Membership(Base):
    __tablename__ = "memberships"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    gym_name = Column(String(255), nullable=False)
    membership_type = Column(String(255), nullable=False)
    monthly_fee = Column(Float, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    user = relationship("User", back_populates="memberships")
    visits = relationship(
        "Visit", back_populates="membership", cascade="all, delete-orphan"
    )


class Visit(Base):
    __tablename__ = "visits"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    membership_id = Column(
        String(36), ForeignKey("memberships.id", ondelete="CASCADE"), nullable=False
    )
    visit_date = Column(Date, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    membership = relationship("Membership", back_populates="visits")


class NotificationSettings(Base):
    __tablename__ = "notification_settings"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )
    inactive_days_threshold = Column(Integer, default=14, nullable=False)
    cost_per_visit_threshold = Column(Float, nullable=True)
    email_notifications_enabled = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    user = relationship("User", back_populates="notification_settings")
