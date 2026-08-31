import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Integer,
    Text,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from server.database import Base


def generate_uuid():
    return str(uuid.uuid4())


def utc_now():
    return datetime.now(timezone.utc)


class Tour(Base):
    __tablename__ = "tours"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    duration_minutes = Column(Integer, nullable=False, default=60)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = Column(
        DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False
    )

    schedules = relationship(
        "Schedule", back_populates="tour", cascade="all, delete-orphan"
    )


class Guide(Base):
    __tablename__ = "guides"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    specialization = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = Column(
        DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False
    )

    schedules = relationship("Schedule", back_populates="guide")


class Schedule(Base):
    __tablename__ = "schedules"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    tour_id = Column(
        String(36), ForeignKey("tours.id", ondelete="CASCADE"), nullable=False
    )
    guide_id = Column(
        String(36), ForeignKey("guides.id", ondelete="SET NULL"), nullable=True
    )
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=False)
    max_capacity = Column(Integer, nullable=False, default=25)
    status = Column(
        String(50), nullable=False, default="Published"
    )  # Draft, Published, Cancelled
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = Column(
        DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False
    )

    tour = relationship("Tour", back_populates="schedules")
    guide = relationship("Guide", back_populates="schedules")
    bookings = relationship(
        "Booking", back_populates="schedule", cascade="all, delete-orphan"
    )
    attendance_records = relationship(
        "Attendance", back_populates="schedule", cascade="all, delete-orphan"
    )


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    schedule_id = Column(
        String(36), ForeignKey("schedules.id", ondelete="CASCADE"), nullable=False
    )
    visitor_name = Column(String(255), nullable=False)
    visitor_email = Column(String(255), nullable=False)
    ticket_quantity = Column(Integer, nullable=False, default=1)
    booking_status = Column(
        String(50), nullable=False, default="Confirmed"
    )  # Confirmed, Cancelled
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = Column(
        DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False
    )

    schedule = relationship("Schedule", back_populates="bookings")
    attendance_records = relationship(
        "Attendance", back_populates="booking", cascade="all, delete-orphan"
    )


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    booking_id = Column(
        String(36), ForeignKey("bookings.id", ondelete="CASCADE"), nullable=False
    )
    schedule_id = Column(
        String(36), ForeignKey("schedules.id", ondelete="CASCADE"), nullable=False
    )
    attended_count = Column(Integer, nullable=False, default=1)
    check_in_time = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = Column(
        DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False
    )

    booking = relationship("Booking", back_populates="attendance_records")
    schedule = relationship("Schedule", back_populates="attendance_records")
