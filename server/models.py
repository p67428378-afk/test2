import uuid
from datetime import datetime
from sqlalchemy import (
    Column,
    String,
    DateTime,
    Boolean,
    ForeignKey,
    Integer,
    Float,
    TypeDecorator,
    CHAR,
)
from sqlalchemy.orm import relationship
from server.database import Base


class GUID(TypeDecorator):
    """Platform-independent GUID type.
    Uses PostgreSQL's UUID type, otherwise uses CHAR(36).
    """

    impl = CHAR
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == "postgresql":
            from sqlalchemy.dialects.postgresql import UUID

            return dialect.type_descriptor(UUID(as_uuid=True))
        else:
            return dialect.type_descriptor(CHAR(36))

    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        elif dialect.name == "postgresql":
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

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    role = Column(
        String(50), default="GATE_STAFF", nullable=False
    )  # 'ADMIN', 'STAGE_MANAGER', 'VOLUNTEER_COORDINATOR', 'GATE_STAFF'
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    volunteers = relationship(
        "Volunteer", back_populates="user", cascade="all, delete-orphan"
    )


class Artist(Base):
    __tablename__ = "artists"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    genre = Column(String(100), nullable=True)
    contact_email = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    performances = relationship(
        "Performance", back_populates="artist", cascade="all, delete-orphan"
    )


class Stage(Base):
    __tablename__ = "stages"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), unique=True, nullable=False)
    location_zone = Column(String(100), nullable=False)
    capacity = Column(Integer, nullable=False, default=5000)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    performances = relationship(
        "Performance", back_populates="stage", cascade="all, delete-orphan"
    )
    telemetry = relationship(
        "CrowdTelemetry", back_populates="stage", cascade="all, delete-orphan"
    )


class Performance(Base):
    __tablename__ = "performances"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    artist_id = Column(
        GUID(), ForeignKey("artists.id", ondelete="CASCADE"), nullable=False
    )
    stage_id = Column(
        GUID(), ForeignKey("stages.id", ondelete="CASCADE"), nullable=False
    )
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    status = Column(
        String(50), default="SCHEDULED", nullable=False
    )  # 'SCHEDULED', 'CANCELLED', 'IN_PROGRESS', 'COMPLETED'
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    artist = relationship("Artist", back_populates="performances")
    stage = relationship("Stage", back_populates="performances")


class Volunteer(Base):
    __tablename__ = "volunteers"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    user_id = Column(GUID(), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    phone = Column(String(50), nullable=True)
    assigned_zone = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    user = relationship("User", back_populates="volunteers")
    shifts = relationship(
        "Shift", back_populates="volunteer", cascade="all, delete-orphan"
    )


class Shift(Base):
    __tablename__ = "shifts"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    volunteer_id = Column(
        GUID(), ForeignKey("volunteers.id", ondelete="CASCADE"), nullable=False
    )
    zone = Column(String(100), nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    status = Column(
        String(50), default="PENDING", nullable=False
    )  # 'PENDING', 'ACTIVE', 'COMPLETED', 'NO_SHOW'
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    volunteer = relationship("Volunteer", back_populates="shifts")


class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    ticket_code = Column(String(100), unique=True, nullable=False, index=True)
    tier = Column(String(100), default="General Admission", nullable=False)
    qr_payload_hash = Column(String(255), nullable=True)
    is_used = Column(Boolean, default=False, nullable=False)
    used_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    scans = relationship(
        "GateScan", back_populates="ticket", cascade="all, delete-orphan"
    )


class GateScan(Base):
    __tablename__ = "gate_scans"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    ticket_id = Column(
        GUID(), ForeignKey("tickets.id", ondelete="CASCADE"), nullable=False
    )
    gate_name = Column(String(100), nullable=False)
    scan_result = Column(
        String(50), nullable=False
    )  # 'VALID', 'DUPLICATE_PASSBACK', 'INVALID_SIGNATURE'
    scanned_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    ticket = relationship("Ticket", back_populates="scans")


class CrowdTelemetry(Base):
    __tablename__ = "crowd_telemetry"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    stage_id = Column(
        GUID(), ForeignKey("stages.id", ondelete="CASCADE"), nullable=False
    )
    current_occupancy = Column(Integer, default=0, nullable=False)
    capacity_ratio = Column(Float, default=0.0, nullable=False)
    alert_triggered = Column(Boolean, default=False, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)

    stage = relationship("Stage", back_populates="telemetry")
