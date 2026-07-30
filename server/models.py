import uuid
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Float, Text
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


class Enclosure(Base):
    __tablename__ = "enclosures"
    id = Column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        unique=True,
        nullable=False,
    )
    name = Column(String(100), nullable=False)
    location_x = Column(Float, nullable=False, default=0.0)
    location_y = Column(Float, nullable=False, default=0.0)
    description = Column(Text, nullable=True)

    animals = relationship("Animal", back_populates="enclosure")


class Animal(Base):
    __tablename__ = "animals"
    id = Column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        unique=True,
        nullable=False,
    )
    name = Column(String(100), nullable=False)
    species = Column(String(100), nullable=False)
    status = Column(String(50), nullable=False, default="Active")
    enclosure_id = Column(String(36), ForeignKey("enclosures.id"), nullable=False)
    habitat = Column(Text, nullable=True)
    diet = Column(Text, nullable=True)
    conservation_status = Column(String(50), nullable=True)
    image_url = Column(String(255), nullable=True)
    qr_code = Column(String(100), nullable=True)

    enclosure = relationship("Enclosure", back_populates="animals")


class Facility(Base):
    __tablename__ = "facilities"
    id = Column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        unique=True,
        nullable=False,
    )
    name = Column(String(100), nullable=False)
    type = Column(String(50), nullable=False)
    location_x = Column(Float, nullable=False, default=0.0)
    location_y = Column(Float, nullable=False, default=0.0)
