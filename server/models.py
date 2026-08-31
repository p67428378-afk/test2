import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()


def generate_uuid() -> str:
    return str(uuid.uuid4())


class Tour(Base):
    __tablename__ = "tours"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    duration_minutes = Column(Integer, nullable=False, default=60)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    schedules = relationship(
        "Schedule", back_populates="tour", cascade="all, delete-orphan"
    )


class Guide(Base):
    __tablename__ = "guides"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True, index=True)
    specialization = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    schedules = relationship("Schedule", back_populates="guide")


class Schedule(Base):
    __tablename__ = "schedules"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    tour_id = Column(
        String(36),
        ForeignKey("tours.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    guide_id = Column(
        String(36),
        ForeignKey("guides.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    start_time = Column(DateTime, nullable=False, index=True)
    end_time = Column(DateTime, nullable=False)
    max_capacity = Column(Integer, nullable=False, default=25)
    status = Column(
        String(50), nullable=False, default="Published"
    )  # Draft, Published, Cancelled
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
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
        String(36),
        ForeignKey("schedules.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    visitor_name = Column(String(255), nullable=False)
    visitor_email = Column(String(255), nullable=False, index=True)
    ticket_quantity = Column(Integer, nullable=False, default=1)
    booking_status = Column(
        String(50), nullable=False, default="Confirmed"
    )  # Confirmed, Cancelled
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    schedule = relationship("Schedule", back_populates="bookings")
    attendance = relationship(
        "Attendance",
        back_populates="booking",
        uselist=False,
        cascade="all, delete-orphan",
    )


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    booking_id = Column(
        String(36),
        ForeignKey("bookings.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    schedule_id = Column(
        String(36),
        ForeignKey("schedules.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    attended_count = Column(Integer, nullable=False, default=1)
    check_in_time = Column(DateTime, default=datetime.utcnow, nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    booking = relationship("Booking", back_populates="attendance")
    schedule = relationship("Schedule", back_populates="attendance_records")
