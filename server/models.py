# server/models.py
import uuid
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Integer, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from server.database import Base


class Event(Base):
    __tablename__ = "events"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    date_time = Column(DateTime(timezone=True), nullable=False)
    location = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    image_url = Column(String(500), nullable=True)
    created_at = Column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    registrations = relationship(
        "Registration", back_populates="event", cascade="all, delete-orphan"
    )
    feedback = relationship(
        "Feedback", back_populates="event", cascade="all, delete-orphan"
    )


class Registration(Base):
    __tablename__ = "registrations"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    event_id = Column(
        String(36), ForeignKey("events.id", ondelete="CASCADE"), nullable=False
    )
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone_number = Column(String(50), nullable=True)
    agree_reminders = Column(Boolean, nullable=False, default=True)
    created_at = Column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    event = relationship("Event", back_populates="registrations")


class Feedback(Base):
    __tablename__ = "feedback"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    event_id = Column(
        String(36), ForeignKey("events.id", ondelete="CASCADE"), nullable=False
    )
    rating = Column(Integer, nullable=False)
    comments = Column(Text, nullable=True)
    created_at = Column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    event = relationship("Event", back_populates="feedback")


class Administrator(Base):
    __tablename__ = "administrators"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(String(100), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
