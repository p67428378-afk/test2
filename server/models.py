import uuid
from sqlalchemy import (
    Column,
    String,
    DateTime,
    Boolean,
    ForeignKey,
    Integer,
    Text,
    Date,
)
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
        if dialect.name == "postgresql":
            return dialect.type_descriptor(PG_UUID(as_uuid=True))
        else:
            return dialect.type_descriptor(CHAR(36))

    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        elif dialect.name == "postgresql":
            return value
        else:
            if isinstance(value, uuid.UUID):
                return str(value)
            else:
                return str(uuid.UUID(value))

    def process_result_value(self, value, dialect):
        if value is None:
            return value
        else:
            if not isinstance(value, uuid.UUID):
                value = uuid.UUID(value)
            return value


class User(Base):
    __tablename__ = "users"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    role = Column(String(50), nullable=False)  # 'Engineer', 'Admin'
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    components = relationship("Component", back_populates="responsible_engineer")


class Component(Base):
    __tablename__ = "components"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    location = Column(String(255), nullable=False)
    status = Column(
        String(50), default="Available", nullable=False
    )  # 'Available', 'Assigned', 'Out of Service'
    inventory_count = Column(Integer, default=0, nullable=False)
    flagged_for_review = Column(Boolean, default=False, nullable=False)
    supervisor_approved = Column(Boolean, default=False, nullable=False)
    responsible_engineer_id = Column(GUID, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    responsible_engineer = relationship("User", back_populates="components")
    certifications = relationship(
        "Certification", back_populates="component", cascade="all, delete-orphan"
    )
    maintenance_events = relationship(
        "MaintenanceEvent", back_populates="component", cascade="all, delete-orphan"
    )
    mission_assignments = relationship(
        "MissionEquipment", back_populates="component", cascade="all, delete-orphan"
    )


class Certification(Base):
    __tablename__ = "certifications"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    component_id = Column(
        GUID, ForeignKey("components.id", ondelete="CASCADE"), nullable=False
    )
    name = Column(String(255), nullable=False)
    issue_date = Column(Date, nullable=False)
    expiry_date = Column(Date, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    component = relationship("Component", back_populates="certifications")


class MaintenanceEvent(Base):
    __tablename__ = "maintenance_events"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    component_id = Column(
        GUID, ForeignKey("components.id", ondelete="CASCADE"), nullable=False
    )
    event_type = Column(String(50), nullable=False)  # 'Inspection', 'Calibration'
    scheduled_date = Column(Date, nullable=False)
    completion_date = Column(Date, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    component = relationship("Component", back_populates="maintenance_events")


class Mission(Base):
    __tablename__ = "missions"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    launch_date = Column(Date, nullable=False)
    status = Column(
        String(50), default="Planning", nullable=False
    )  # 'Planning', 'Active', 'Completed'
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    equipment_assignments = relationship(
        "MissionEquipment", back_populates="mission", cascade="all, delete-orphan"
    )


class MissionEquipment(Base):
    __tablename__ = "mission_equipment"

    mission_id = Column(
        GUID, ForeignKey("missions.id", ondelete="CASCADE"), primary_key=True
    )
    component_id = Column(
        GUID, ForeignKey("components.id", ondelete="CASCADE"), primary_key=True
    )
    assigned_at = Column(DateTime, default=func.now(), nullable=False)

    mission = relationship("Mission", back_populates="equipment_assignments")
    component = relationship("Component", back_populates="mission_assignments")
