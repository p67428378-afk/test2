import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Integer, Float, Text, Date
from sqlalchemy.orm import relationship
from server.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    login_id = Column(String(255), unique=True, nullable=False)
    mobile_number = Column(String(20), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    security_question = Column(String(255), nullable=False)
    security_answer_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    otps = relationship("OTP", back_populates="user")
    password_history = relationship("PasswordHistory", back_populates="user")
    tasks = relationship("Task", back_populates="user")

class OTP(Base):
    __tablename__ = "otps"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    otp_code_hash = Column(String(255), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.now)

    user = relationship("User", back_populates="otps")

class PasswordHistory(Base):
    __tablename__ = "password_history"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    changed_at = Column(DateTime, default=datetime.now)

    user = relationship("User", back_populates="password_history")

class Flower(Base):
    __tablename__ = "flowers"
    flower_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    flower_type = Column(String(255), unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    inventory_items = relationship("Inventory", back_populates="flower")
    plant_batches = relationship("PlantBatch", back_populates="flower")

class Inventory(Base):
    __tablename__ = "inventory"
    inventory_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    flower_id = Column(String(36), ForeignKey("flowers.flower_id"), nullable=False)
    quantity = Column(Integer, default=0, nullable=False)
    harvest_date = Column(DateTime, nullable=False)
    status = Column(String(50), default='Fresh', nullable=False)
    shelf_life = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    flower = relationship("Flower", back_populates="inventory_items")

class PlantBatch(Base):
    __tablename__ = "plant_batches"
    batch_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    flower_id = Column(String(36), ForeignKey("flowers.flower_id"), nullable=False)
    growth_stage = Column(String(50), default='Seeding', nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    flower = relationship("Flower", back_populates="plant_batches")
    sensor_data = relationship("SensorData", back_populates="plant_batch")

class SensorData(Base):
    __tablename__ = "sensor_data"
    data_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    batch_id = Column(String(36), ForeignKey("plant_batches.batch_id"), nullable=False)
    temperature = Column(Float, nullable=False)
    humidity = Column(Float, nullable=False)
    soil_moisture = Column(Float, nullable=False)
    light_intensity = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.now)

    plant_batch = relationship("PlantBatch", back_populates="sensor_data")

class Task(Base):
    __tablename__ = "tasks"
    task_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    task_type = Column(String(50), nullable=False)
    description = Column(Text, nullable=True)
    scheduled_date = Column(Date, nullable=False)
    status = Column(String(50), default='Pending', nullable=False)
    time_spent = Column(Integer, default=0, nullable=True)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    user = relationship("User", back_populates="tasks")
