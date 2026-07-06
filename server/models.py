import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from server.database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="user")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    service_requests = relationship(
        "ServiceRequest", back_populates="assigned_technician"
    )


class EnergySource(Base):
    __tablename__ = "energy_sources"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    type = Column(String(50), nullable=False)  # solar, wind, battery, grid, generator
    status = Column(String(50), nullable=False, default="active")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    realtime_metrics = relationship(
        "RealtimeMetric", back_populates="energy_source", cascade="all, delete-orphan"
    )
    historical_metrics = relationship(
        "HistoricalMetric", back_populates="energy_source", cascade="all, delete-orphan"
    )
    alerts = relationship(
        "Alert", back_populates="energy_source", cascade="all, delete-orphan"
    )


class RealtimeMetric(Base):
    __tablename__ = "realtime_metrics"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    energy_source_id = Column(
        String(36), ForeignKey("energy_sources.id"), nullable=False
    )
    metric_name = Column(String(100), nullable=False)
    metric_value = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)

    energy_source = relationship("EnergySource", back_populates="realtime_metrics")


class HistoricalMetric(Base):
    __tablename__ = "historical_metrics"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    energy_source_id = Column(
        String(36), ForeignKey("energy_sources.id"), nullable=False
    )
    metric_name = Column(String(100), nullable=False)
    metric_value = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)

    energy_source = relationship("EnergySource", back_populates="historical_metrics")


class Alert(Base):
    __tablename__ = "alerts"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    energy_source_id = Column(
        String(36), ForeignKey("energy_sources.id"), nullable=False
    )
    parameter_name = Column(String(100), nullable=False)
    parameter_value = Column(Float, nullable=False)
    threshold_value = Column(Float, nullable=False)
    severity = Column(String(50), nullable=False, default="warning")
    status = Column(String(50), nullable=False, default="active")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    energy_source = relationship("EnergySource", back_populates="alerts")
    service_request = relationship(
        "ServiceRequest", back_populates="alert", uselist=False
    )


class ServiceRequest(Base):
    __tablename__ = "service_requests"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    alert_id = Column(String(36), ForeignKey("alerts.id"), nullable=True)
    equipment = Column(String(255), nullable=False)
    location = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(
        String(50), nullable=False, default="New"
    )  # New, In Progress, Resolved
    assigned_technician_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )
    activity_log_json = Column(
        Text, nullable=True, default="[]"
    )  # JSON string of activity logs

    alert = relationship("Alert", back_populates="service_request")
    assigned_technician = relationship("User", back_populates="service_requests")
