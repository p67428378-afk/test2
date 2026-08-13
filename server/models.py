import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from server.database import Base


def generate_uuid():
    return str(uuid.uuid4())


class Artist(Base):
    __tablename__ = "artists"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False, index=True)
    genre = Column(String(100), nullable=False)
    tech_spec_summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    performances = relationship("Performance", back_populates="artist")


class Stage(Base):
    __tablename__ = "stages"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False, index=True)
    location_zone = Column(String(100), nullable=False)
    max_capacity = Column(Integer, nullable=False, default=10000)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    performances = relationship("Performance", back_populates="stage")
    notifications = relationship("StageNotification", back_populates="stage")


class Performance(Base):
    __tablename__ = "performances"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    stage_id = Column(String(36), ForeignKey("stages.id"), nullable=False)
    artist_id = Column(String(36), ForeignKey("artists.id"), nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    buffer_minutes = Column(Integer, nullable=False, default=30)
    status = Column(
        String(50), nullable=False, default="SCHEDULED"
    )  # SCHEDULED, DELAYED, COMPLETED, CANCELLED
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    stage = relationship("Stage", back_populates="performances")
    artist = relationship("Artist", back_populates="performances")


class StageNotification(Base):
    __tablename__ = "stage_notifications"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    stage_id = Column(String(36), ForeignKey("stages.id"), nullable=False)
    performance_id = Column(String(36), ForeignKey("performances.id"), nullable=True)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    stage = relationship("Stage", back_populates="notifications")


class Volunteer(Base):
    __tablename__ = "volunteers"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True, index=True)
    phone = Column(String(50), nullable=False)
    assigned_zone = Column(String(100), nullable=False)
    status = Column(
        String(50), nullable=False, default="ACTIVE"
    )  # ACTIVE, STANDBY, INACTIVE
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    shifts = relationship("VolunteerShift", back_populates="volunteer")


class VolunteerShift(Base):
    __tablename__ = "volunteer_shifts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    volunteer_id = Column(String(36), ForeignKey("volunteers.id"), nullable=True)
    zone_name = Column(String(100), nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    check_in_time = Column(DateTime, nullable=True)
    status = Column(
        String(50), nullable=False, default="UNASSIGNED"
    )  # UNASSIGNED, ASSIGNED, CHECKED_IN, ABSENT, DROPPED
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    volunteer = relationship("Volunteer", back_populates="shifts")
    alerts = relationship("StandbyAlert", back_populates="shift")


class StandbyAlert(Base):
    __tablename__ = "standby_alerts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    shift_id = Column(String(36), ForeignKey("volunteer_shifts.id"), nullable=True)
    zone_name = Column(String(100), nullable=False)
    alert_type = Column(
        String(100), nullable=False
    )  # ABSENCE_REPLACEMENT, STANDBY_BROADCAST
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    shift = relationship("VolunteerShift", back_populates="alerts")


class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    ticket_code = Column(String(100), nullable=False, unique=True, index=True)
    qr_payload_hash = Column(String(255), nullable=True)
    tier = Column(String(100), nullable=False, default="General Admission")
    status = Column(String(50), nullable=False, default="VALID")  # VALID, USED, REVOKED
    scanned_at = Column(DateTime, nullable=True)
    scanned_gate = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class CrowdSensorEvent(Base):
    __tablename__ = "crowd_sensor_events"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    zone_id = Column(String(100), nullable=False, index=True)
    sensor_id = Column(String(100), nullable=False)
    ingress_count = Column(Integer, nullable=False, default=0)
    egress_count = Column(Integer, nullable=False, default=0)
    current_occupancy = Column(Integer, nullable=False, default=0)
    recorded_at = Column(DateTime, default=datetime.utcnow, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
