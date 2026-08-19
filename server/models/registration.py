import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from server.database import Base


class Registration(Base):
    __tablename__ = "registrations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    conference_id = Column(String(36), ForeignKey("conferences.id"), nullable=False)
    attendee_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    ticket_type = Column(String(50), nullable=False, default="STANDARD")
    status = Column(String(50), default="CONFIRMED")
    registered_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    conference = relationship("Conference", back_populates="registrations")
    attendee = relationship("User", back_populates="registrations")
