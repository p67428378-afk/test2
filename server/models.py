import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, DateTime, Date, ForeignKey, Text
from sqlalchemy.orm import relationship

from server.database import Base


# Helper to generate UUIDs as strings or UUID objects depending on DB
def generate_uuid():
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    hives = relationship("Hive", back_populates="user", cascade="all, delete-orphan")


class Hive(Base):
    __tablename__ = "hives"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    status = Column(String, default="healthy", nullable=False)
    honey_capacity_pct = Column(Float, default=0.0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    user = relationship("User", back_populates="hives")
    sensor_data = relationship(
        "SensorData", back_populates="hive", cascade="all, delete-orphan"
    )
    production_logs = relationship(
        "ProductionLog", back_populates="hive", cascade="all, delete-orphan"
    )
    population_logs = relationship(
        "PopulationLog", back_populates="hive", cascade="all, delete-orphan"
    )
    inspections = relationship(
        "Inspection", back_populates="hive", cascade="all, delete-orphan"
    )
    disease_reports = relationship(
        "DiseaseReport", back_populates="hive", cascade="all, delete-orphan"
    )


class SensorData(Base):
    __tablename__ = "sensor_data"

    id = Column(String, primary_key=True, default=generate_uuid)
    hive_id = Column(String, ForeignKey("hives.id"), nullable=False)
    timestamp = Column(DateTime, nullable=False)
    temperature = Column(Float, nullable=False)
    humidity = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    hive = relationship("Hive", back_populates="sensor_data")


class ProductionLog(Base):
    __tablename__ = "production_logs"

    id = Column(String, primary_key=True, default=generate_uuid)
    hive_id = Column(String, ForeignKey("hives.id"), nullable=False)
    date = Column(Date, nullable=False)
    quantity_kg = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    hive = relationship("Hive", back_populates="production_logs")


class PopulationLog(Base):
    __tablename__ = "population_logs"

    id = Column(String, primary_key=True, default=generate_uuid)
    hive_id = Column(String, ForeignKey("hives.id"), nullable=False)
    date = Column(Date, nullable=False)
    estimated_population = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    hive = relationship("Hive", back_populates="population_logs")


class Inspection(Base):
    __tablename__ = "inspections"

    id = Column(String, primary_key=True, default=generate_uuid)
    hive_id = Column(String, ForeignKey("hives.id"), nullable=False)
    inspection_date = Column(Date, nullable=False)
    inspector = Column(String, nullable=True)
    focus_area = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    hive = relationship("Hive", back_populates="inspections")


class DiseaseReport(Base):
    __tablename__ = "disease_reports"

    id = Column(String, primary_key=True, default=generate_uuid)
    hive_id = Column(String, ForeignKey("hives.id"), nullable=False)
    report_date = Column(Date, nullable=False)
    symptoms = Column(String, nullable=True)
    severity = Column(String, nullable=True)
    observations = Column(Text, nullable=True)
    status = Column(String, default="pending", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    hive = relationship("Hive", back_populates="disease_reports")
