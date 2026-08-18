import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from server.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(
        String, nullable=False, default="Visitor"
    )  # Visitor, Guide, Administrator
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    schedules = relationship(
        "Schedule", back_populates="guide", foreign_keys="Schedule.guide_id"
    )
    bookings = relationship(
        "Booking", back_populates="visitor", foreign_keys="Booking.visitor_id"
    )


class Tour(Base):
    __tablename__ = "tours"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    duration_minutes = Column(Integer, default=60, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    schedules = relationship(
        "Schedule", back_populates="tour", cascade="all, delete-orphan"
    )


class Schedule(Base):
    __tablename__ = "schedules"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    tour_id = Column(String, ForeignKey("tours.id"), nullable=False)
    guide_id = Column(String, ForeignKey("users.id"), nullable=True)
    start_time = Column(DateTime, nullable=False)
    max_capacity = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    tour = relationship("Tour", back_populates="schedules")
    guide = relationship("User", back_populates="schedules", foreign_keys=[guide_id])
    bookings = relationship(
        "Booking", back_populates="schedule", cascade="all, delete-orphan"
    )


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    schedule_id = Column(String, ForeignKey("schedules.id"), nullable=False)
    visitor_id = Column(String, ForeignKey("users.id"), nullable=False)
    ticket_count = Column(Integer, default=1, nullable=False)
    status = Column(
        String, default="Confirmed", nullable=False
    )  # Pending, Confirmed, Cancelled
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    schedule = relationship("Schedule", back_populates="bookings")
    visitor = relationship("User", back_populates="bookings", foreign_keys=[visitor_id])
    attendance = relationship(
        "Attendance",
        back_populates="booking",
        uselist=False,
        cascade="all, delete-orphan",
    )


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    booking_id = Column(String, ForeignKey("bookings.id"), unique=True, nullable=False)
    status = Column(
        String, default="Unchecked", nullable=False
    )  # Unchecked, Checked-in, No-show
    checked_in_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    booking = relationship("Booking", back_populates="attendance")
