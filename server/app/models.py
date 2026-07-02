import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from server.app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    role = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    incidents = relationship("Incident", back_populates="assignee")


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String(50), default="Open", nullable=False)
    priority = Column(String(50), nullable=False)
    affected_system = Column(String(255), nullable=False)
    reporter_name = Column(String(255), nullable=False)
    reporter_email = Column(String(255), nullable=False)
    assignee_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    internal_notes = Column(Text, nullable=True)
    occurred_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    assignee = relationship("User", back_populates="incidents")
    rca_report = relationship("RCAReport", back_populates="incident", uselist=False)


class SLA(Base):
    __tablename__ = "slas"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    priority = Column(String(50), unique=True, nullable=False)
    response_time = Column(Integer, nullable=False)  # in minutes
    resolution_time = Column(Integer, nullable=False)  # in minutes
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )


class RCAReport(Base):
    __tablename__ = "rca_reports"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    incident_id = Column(
        String(36), ForeignKey("incidents.id"), nullable=False, unique=True
    )
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    incident = relationship("Incident", back_populates="rca_report")
