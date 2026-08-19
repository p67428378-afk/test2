import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from server.database import Base


class Conference(Base):
    __tablename__ = "conferences"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    location = Column(String(255), nullable=False)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    organizer_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    status = Column(String(50), default="DRAFT")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    organizer = relationship("User", back_populates="organized_conferences")
    sessions = relationship("Session", back_populates="conference")
    registrations = relationship("Registration", back_populates="conference")
    schedules = relationship("Schedule", back_populates="conference")
