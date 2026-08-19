import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from server.database import Base


class Schedule(Base):
    __tablename__ = "schedules"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    conference_id = Column(String(36), ForeignKey("conferences.id"), nullable=False)
    session_id = Column(
        String(36), ForeignKey("sessions.id"), nullable=False, unique=True
    )
    hall_name = Column(String(100), nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    conference = relationship("Conference", back_populates="schedules")
    session = relationship("Session", back_populates="schedule")
