import uuid
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, DECIMAL, TEXT
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from server.database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="owner")
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(
        DateTime, nullable=False, default=func.now(), onupdate=func.now()
    )

    solar_systems = relationship(
        "SolarSystem", back_populates="user", cascade="all, delete-orphan"
    )
    service_requests = relationship("ServiceRequest", back_populates="technician")


class SolarSystem(Base):
    __tablename__ = "solar_systems"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    name = Column(String(255), nullable=False)
    status = Column(String(50), nullable=False, default="Online")
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(
        DateTime, nullable=False, default=func.now(), onupdate=func.now()
    )

    user = relationship("User", back_populates="solar_systems")
    energy_data = relationship(
        "EnergyData", back_populates="system", cascade="all, delete-orphan"
    )
    alerts = relationship(
        "Alert", back_populates="system", cascade="all, delete-orphan"
    )


class EnergyData(Base):
    __tablename__ = "energy_data"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    system_id = Column(
        UUID(as_uuid=True),
        ForeignKey("solar_systems.id", ondelete="CASCADE"),
        nullable=False,
    )
    current_power_kw = Column(DECIMAL(10, 2), nullable=False)
    efficiency_pct = Column(DECIMAL(5, 2), nullable=False)
    today_generation_kwh = Column(DECIMAL(10, 2), nullable=False)
    recorded_at = Column(DateTime, nullable=False, default=func.now())

    system = relationship("SolarSystem", back_populates="energy_data")


class Alert(Base):
    __tablename__ = "alerts"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    system_id = Column(
        UUID(as_uuid=True),
        ForeignKey("solar_systems.id", ondelete="CASCADE"),
        nullable=False,
    )
    severity = Column(String(50), nullable=False)
    description = Column(TEXT, nullable=False)
    is_resolved = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(
        DateTime, nullable=False, default=func.now(), onupdate=func.now()
    )

    system = relationship("SolarSystem", back_populates="alerts")
    service_request = relationship(
        "ServiceRequest",
        back_populates="alert",
        uselist=False,
        cascade="all, delete-orphan",
    )


class ServiceRequest(Base):
    __tablename__ = "service_requests"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    alert_id = Column(
        UUID(as_uuid=True), ForeignKey("alerts.id", ondelete="CASCADE"), nullable=False
    )
    technician_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    status = Column(String(50), nullable=False, default="New")
    notes = Column(TEXT, nullable=True)
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(
        DateTime, nullable=False, default=func.now(), onupdate=func.now()
    )

    alert = relationship("Alert", back_populates="service_request")
    technician = relationship("User", back_populates="service_requests")
