"""
Module: server.models.ticket
Purpose: SupportTicket model definition.
"""

import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from server.database import Base


class SupportTicket(Base):
    __tablename__ = "support_tickets"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    issue_type = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(
        String(50), default="open", nullable=False
    )  # open, resolved, closed
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    user = relationship("User", back_populates="tickets")
