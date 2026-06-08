import uuid
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Float
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


class Pipeline(Base):
    __tablename__ = "pipelines"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), unique=True, nullable=False)
    location = Column(String(255), nullable=False)
    status = Column(String(50), default="normal", nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    sensors = relationship("Sensor", back_populates="pipeline", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="pipeline", cascade="all, delete-orphan")
    maintenance_orders = relationship("MaintenanceOrder", back_populates="pipeline", cascade="all, delete-orphan")


class Sensor(Base):
    __tablename__ = "sensors"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    pipeline_id = Column(UUID(as_uuid=True), ForeignKey("pipelines.id"), nullable=False)
    type = Column(String(100), nullable=False)
    location = Column(String(255), nullable=False)
    current_reading = Column(Float, nullable=True, default=None)
    status = Column(String(50), default="normal", nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    pipeline = relationship("Pipeline", back_populates="sensors")
    pressure_readings = relationship("PressureReading", back_populates="sensor", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="sensor", cascade="all, delete-orphan")


class PressureReading(Base):
    __tablename__ = "pressure_readings"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sensor_id = Column(UUID(as_uuid=True), ForeignKey("sensors.id"), nullable=False)
    timestamp = Column(DateTime, default=func.now(), nullable=False)
    value = Column(Float, nullable=False)

    sensor = relationship("Sensor", back_populates="pressure_readings")


class Alert(Base):
    __tablename__ = "alerts"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sensor_id = Column(UUID(as_uuid=True), ForeignKey("sensors.id"), nullable=False)
    pipeline_id = Column(UUID(as_uuid=True), ForeignKey("pipelines.id"), nullable=False)
    severity = Column(String(50), nullable=False)  # minor, moderate, critical
    status = Column(String(50), default="active", nullable=False)  # active, acknowledged, resolved
    location = Column(String(255), nullable=False)
    timestamp = Column(DateTime, default=func.now(), nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)

    sensor = relationship("Sensor", back_populates="alerts")
    pipeline = relationship("Pipeline", back_populates="alerts")


class MaintenanceOrder(Base):
    __tablename__ = "maintenance_orders"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    pipeline_id = Column(UUID(as_uuid=True), ForeignKey("pipelines.id"), nullable=False)
    description = Column(String(1000), nullable=False)
    assigned_to = Column(String(255), nullable=False)
    priority = Column(String(50), nullable=False)  # low, medium, high
    due_date = Column(DateTime, nullable=False)
    status = Column(String(50), default="pending", nullable=False)  # pending, in_progress, completed
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    pipeline = relationship("Pipeline", back_populates="maintenance_orders")
