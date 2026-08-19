import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from server.database import Base


class AttendanceLog(Base):
    __tablename__ = "attendance_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String(36), ForeignKey("sessions.id"), nullable=False)
    attendee_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    checked_in_at = Column(DateTime, default=datetime.utcnow)
    checked_in_by = Column(String(36), ForeignKey("users.id"), nullable=False)

    # Relationships
    session = relationship("Session", back_populates="attendance_logs")
    attendee = relationship("User", foreign_keys=[attendee_id])
    checker = relationship("User", foreign_keys=[checked_in_by])
