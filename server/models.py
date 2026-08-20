import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, Text, DateTime, Date, ForeignKey
from sqlalchemy.orm import relationship
from server.database import Base


class Apiary(Base):
    __tablename__ = "apiaries"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    location = Column(String(255), nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    hives = relationship("Hive", back_populates="apiary", cascade="all, delete-orphan")


class Hive(Base):
    __tablename__ = "hives"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    apiary_id = Column(
        String(36), ForeignKey("apiaries.id"), nullable=False, index=True
    )
    hive_number = Column(String(100), nullable=False)
    queen_breed = Column(String(100), nullable=True)
    queen_installed_date = Column(Date, nullable=True)
    status = Column(
        String(50), default="active", nullable=False
    )  # active, quarantined, inactive
    estimated_population = Column(Integer, default=0, nullable=False)
    frame_count = Column(Integer, default=10, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    apiary = relationship("Apiary", back_populates="hives")
    telemetry_logs = relationship(
        "TelemetryLog", back_populates="hive", cascade="all, delete-orphan"
    )
    harvests = relationship(
        "HoneyHarvest", back_populates="hive", cascade="all, delete-orphan"
    )
    disease_reports = relationship(
        "DiseaseReport", back_populates="hive", cascade="all, delete-orphan"
    )
    inspections = relationship(
        "Inspection", back_populates="hive", cascade="all, delete-orphan"
    )


class TelemetryLog(Base):
    __tablename__ = "telemetry_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    hive_id = Column(String(36), ForeignKey("hives.id"), nullable=False, index=True)
    temperature_celsius = Column(Float, nullable=False)
    humidity_percent = Column(Float, nullable=False)
    weight_kg = Column(Float, nullable=True)
    recorded_at = Column(DateTime, nullable=False, default=datetime.utcnow, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    hive = relationship("Hive", back_populates="telemetry_logs")


class HoneyHarvest(Base):
    __tablename__ = "honey_harvests"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    hive_id = Column(String(36), ForeignKey("hives.id"), nullable=False, index=True)
    harvest_date = Column(Date, nullable=False)
    quantity_kg = Column(Float, nullable=False)
    honey_type = Column(String(100), nullable=True)
    moisture_content_percent = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    hive = relationship("Hive", back_populates="harvests")


class DiseaseReport(Base):
    __tablename__ = "disease_reports"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    hive_id = Column(String(36), ForeignKey("hives.id"), nullable=False, index=True)
    disease_name = Column(String(150), nullable=False)
    severity_level = Column(String(50), nullable=False)  # Low, Medium, High, Critical
    symptoms_description = Column(Text, nullable=False)
    treatment_applied = Column(Text, nullable=True)
    report_date = Column(DateTime, default=datetime.utcnow, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    hive = relationship("Hive", back_populates="disease_reports")


class Inspection(Base):
    __tablename__ = "inspections"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    hive_id = Column(String(36), ForeignKey("hives.id"), nullable=False, index=True)
    scheduled_date = Column(DateTime, nullable=False)
    inspector_name = Column(String(150), nullable=False)
    status = Column(
        String(50), default="scheduled", nullable=False
    )  # scheduled, in_progress, completed, cancelled
    notes = Column(Text, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    hive = relationship("Hive", back_populates="inspections")
