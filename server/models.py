import uuid
from sqlalchemy import Column, String, DateTime, Float, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from server.database import Base


class Schedule(Base):
    __tablename__ = "schedules"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    vessel_name = Column(String(255), nullable=False)
    route = Column(Text, nullable=False)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    destination_port = Column(String(10), nullable=False)
    status = Column(String(50), nullable=False, default="Planned")
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(
        DateTime, nullable=False, default=func.now(), onupdate=func.now()
    )

    expeditions = relationship(
        "Expedition", back_populates="schedule", cascade="all, delete-orphan"
    )


class Expedition(Base):
    __tablename__ = "expeditions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    schedule_id = Column(UUID(as_uuid=True), ForeignKey("schedules.id"), nullable=False)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    research_goals = Column(Text, nullable=False)
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(
        DateTime, nullable=False, default=func.now(), onupdate=func.now()
    )

    schedule = relationship("Schedule", back_populates="expeditions")
    crew_assignments = relationship(
        "ExpeditionCrew", back_populates="expedition", cascade="all, delete-orphan"
    )
    samples = relationship(
        "Sample", back_populates="expedition", cascade="all, delete-orphan"
    )


class Equipment(Base):
    __tablename__ = "equipment"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    serial_number = Column(String(100), unique=True, nullable=False)
    status = Column(String(50), nullable=False, default="Operational")
    location = Column(String(100), nullable=False)
    last_maintenance_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(
        DateTime, nullable=False, default=func.now(), onupdate=func.now()
    )


class FuelLog(Base):
    __tablename__ = "fuel_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    vessel_id = Column(String(100), nullable=False)
    timestamp = Column(DateTime, nullable=False, default=func.now())
    fuel_consumed = Column(Float, nullable=False, default=0.0)
    distance_traveled = Column(Float, nullable=False, default=0.0)
    created_at = Column(DateTime, nullable=False, default=func.now())


class Crew(Base):
    __tablename__ = "crew"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    certification = Column(String(255), nullable=False)
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(
        DateTime, nullable=False, default=func.now(), onupdate=func.now()
    )

    expedition_assignments = relationship(
        "ExpeditionCrew", back_populates="crew", cascade="all, delete-orphan"
    )


class ExpeditionCrew(Base):
    __tablename__ = "expedition_crew"

    expedition_id = Column(
        UUID(as_uuid=True), ForeignKey("expeditions.id"), primary_key=True
    )
    crew_id = Column(UUID(as_uuid=True), ForeignKey("crew.id"), primary_key=True)
    role = Column(String(100), nullable=False)

    expedition = relationship("Expedition", back_populates="crew_assignments")
    crew = relationship("Crew", back_populates="expedition_assignments")


class Sample(Base):
    __tablename__ = "samples"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    expedition_id = Column(
        UUID(as_uuid=True), ForeignKey("expeditions.id"), nullable=False
    )
    sample_type = Column(String(100), nullable=False)
    collection_date = Column(DateTime, nullable=False)
    storage_location = Column(String(100), nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(
        DateTime, nullable=False, default=func.now(), onupdate=func.now()
    )

    expedition = relationship("Expedition", back_populates="samples")
