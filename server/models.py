import uuid
from sqlalchemy import (
    Column,
    String,
    DateTime,
    Boolean,
    ForeignKey,
    Numeric,
    JSON,
    Float,
)
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


class Claim(Base):
    __tablename__ = "claims"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    policyholder_id = Column(UUID(as_uuid=True), nullable=False)
    status = Column(String(50), nullable=False, default="PROCESSING")
    estimated_cost = Column(Numeric(10, 2), nullable=True)
    damage_breakdown = Column(JSON, nullable=True)
    has_conflict = Column(Boolean, nullable=False, default=False)
    manual_amount = Column(Numeric(10, 2), nullable=True)
    manual_date = Column(DateTime, nullable=True)
    created_at = Column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    images = relationship(
        "ClaimImage", back_populates="claim", cascade="all, delete-orphan"
    )
    dispatch = relationship(
        "Dispatch", back_populates="claim", uselist=False, cascade="all, delete-orphan"
    )


class Estimate(Base):
    __tablename__ = "estimates"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    claim_id = Column(UUID(as_uuid=True), ForeignKey("claims.id"), nullable=False)
    ai_amount = Column(Numeric(10, 2), nullable=False, default=0.00)
    currency = Column(String(10), nullable=False, default="USD")
    details = Column(String, nullable=True)
    has_conflict = Column(Boolean, nullable=False, default=False)
    manual_amount = Column(Numeric(10, 2), nullable=True)
    manual_date = Column(DateTime, nullable=True)
    created_at = Column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )


class Photo(Base):
    __tablename__ = "photos"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    claim_id = Column(UUID(as_uuid=True), ForeignKey("claims.id"), nullable=False)
    gcs_url = Column(String(512), nullable=False)
    created_at = Column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )


class ClaimImage(Base):
    __tablename__ = "claim_images"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    claim_id = Column(UUID(as_uuid=True), ForeignKey("claims.id"), nullable=False)
    image_url = Column(String(512), nullable=False)
    created_at = Column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    claim = relationship("Claim", back_populates="images")


class Dispatch(Base):
    __tablename__ = "dispatches"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    claim_id = Column(
        UUID(as_uuid=True), ForeignKey("claims.id"), nullable=False, unique=True
    )
    status = Column(String(50), nullable=False, default="PENDING")
    gps_latitude = Column(Float, nullable=False)
    gps_longitude = Column(Float, nullable=False)
    created_at = Column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    claim = relationship("Claim", back_populates="dispatch")


class IdempotencyKey(Base):
    __tablename__ = "idempotency_keys"
    key = Column(String(255), primary_key=True)
    response_body = Column(String, nullable=False)
    created_at = Column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
