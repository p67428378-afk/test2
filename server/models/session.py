import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from server.database import Base


class Session(Base):
    __tablename__ = "sessions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    conference_id = Column(String(36), ForeignKey("conferences.id"), nullable=False)
    speaker_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    abstract = Column(Text, nullable=False)
    track = Column(String(100), nullable=False)
    status = Column(String(50), default="SUBMITTED")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    conference = relationship("Conference", back_populates="sessions")
    speaker = relationship("User", back_populates="sessions")
    reviews = relationship("Review", back_populates="session")
    schedule = relationship("Schedule", back_populates="session", uselist=False)
    attendance_logs = relationship("AttendanceLog", back_populates="session")
