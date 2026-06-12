import uuid
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Integer, Text
from sqlalchemy.types import TypeDecorator, CHAR
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from server.database import Base

class GUID(TypeDecorator):
    """Platform-independent GUID type.
    Uses PostgreSQL's UUID type, otherwise CHAR(36), storing as string.
    """
    impl = CHAR
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == 'postgresql':
            return dialect.type_descriptor(PG_UUID(as_uuid=True))
        else:
            return dialect.type_descriptor(CHAR(36))

    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        elif dialect.name == 'postgresql':
            return str(value)
        else:
            if not isinstance(value, uuid.UUID):
                return str(uuid.UUID(value))
            else:
                return str(value)

    def process_result_value(self, value, dialect):
        if value is None:
            return value
        else:
            if not isinstance(value, uuid.UUID):
                return uuid.UUID(value)
            else:
                return value

class User(Base):
    __tablename__ = "users"
    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    login_id = Column(String(255), unique=True, nullable=False)
    mobile_number = Column(String(20), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    security_question = Column(String(255), nullable=False)
    security_answer_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    otps = relationship("OTP", back_populates="user")
    password_history = relationship("PasswordHistory", back_populates="user")
    trail_reports = relationship("TrailReport", back_populates="user")
    wildlife_sightings = relationship("WildlifeSighting", back_populates="user")

class OTP(Base):
    __tablename__ = "otps"
    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    user_id = Column(GUID, ForeignKey("users.id"), nullable=False)
    otp_code_hash = Column(String(255), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())

    user = relationship("User", back_populates="otps")

class PasswordHistory(Base):
    __tablename__ = "password_history"
    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    user_id = Column(GUID, ForeignKey("users.id"), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    changed_at = Column(DateTime, default=func.now())

    user = relationship("User", back_populates="password_history")

class Trail(Base):
    __tablename__ = "trails"
    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    name = Column(String(255), unique=True, nullable=False)
    status = Column(String(50), default="Open", nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    reports = relationship("TrailReport", back_populates="trail")
    access_rules = relationship("AccessRule", back_populates="trail")

class TrailReport(Base):
    __tablename__ = "trail_reports"
    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    trail_id = Column(GUID, ForeignKey("trails.id"), nullable=False)
    user_id = Column(GUID, ForeignKey("users.id"), nullable=False)
    condition = Column(String(50), nullable=False)
    notes = Column(Text, nullable=True)
    media_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)

    trail = relationship("Trail", back_populates="reports")
    user = relationship("User", back_populates="trail_reports")

class WildlifeSighting(Base):
    __tablename__ = "wildlife_sightings"
    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    user_id = Column(GUID, ForeignKey("users.id"), nullable=False)
    species = Column(String(255), nullable=False)
    count = Column(Integer, default=1, nullable=False)
    location = Column(String(255), nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)

    user = relationship("User", back_populates="wildlife_sightings")

class AccessRule(Base):
    __tablename__ = "access_rules"
    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    trail_id = Column(GUID, ForeignKey("trails.id"), nullable=False)
    is_closed = Column(Boolean, default=False, nullable=False)
    reason = Column(Text, nullable=True)
    start_time = Column(DateTime, nullable=True)
    end_time = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)

    trail = relationship("Trail", back_populates="access_rules")
