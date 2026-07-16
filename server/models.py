import uuid
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Float, Date, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from server.database import Base

# Keep existing User, OTP, PasswordHistory models for backward compatibility
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


# Wildlife Conservation System Models
class Animal(Base):
    __tablename__ = "animals"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    species = Column(String(255), nullable=False)
    gps_tag_id = Column(String(255), unique=True, nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    locations = relationship("GPSLocation", back_populates="animal", cascade="all, delete-orphan")
    health_examinations = relationship("HealthExamination", back_populates="animal", cascade="all, delete-orphan")

class GPSLocation(Base):
    __tablename__ = "gps_locations"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    animal_id = Column(UUID(as_uuid=True), ForeignKey("animals.id"), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    timestamp = Column(DateTime(timezone=True), default=func.now(), nullable=False)

    animal = relationship("Animal", back_populates="locations")

class HealthExamination(Base):
    __tablename__ = "health_examinations"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    animal_id = Column(UUID(as_uuid=True), ForeignKey("animals.id"), nullable=False)
    examination_date = Column(Date, nullable=False)
    veterinarian = Column(String(255), nullable=False)
    health_status = Column(String(255), nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=func.now())

    animal = relationship("Animal", back_populates="health_examinations")

class ProtectedZone(Base):
    __tablename__ = "protected_zones"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    area = Column(Text, nullable=False) # JSON string representing coordinates/polygon
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
