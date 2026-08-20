"""SQLAlchemy model for Queue Tickets."""

import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, Index
from server.database import Base


def utc_now() -> datetime:
    """Return current UTC time."""
    return datetime.now(timezone.utc)


class QueueTicket(Base):
    """Represents a customer queue ticket."""

    __tablename__ = "queue_tickets"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    ticket_number = Column(String(20), nullable=False, unique=True, index=True)
    sequence_num = Column(Integer, nullable=False, index=True)
    customer_name = Column(String(100), nullable=False)
    service_type = Column(String(50), nullable=False, index=True)
    status = Column(String(20), nullable=False, default="Waiting", index=True)
    counter_number = Column(String(30), nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, default=utc_now)
    updated_at = Column(
        DateTime(timezone=True), nullable=False, default=utc_now, onupdate=utc_now
    )

    __table_args__ = (
        Index("idx_queue_tickets_status_created", "status", "created_at"),
    )

    def __repr__(self) -> str:
        return f"<QueueTicket(ticket_number={self.ticket_number}, status={self.status}, customer={self.customer_name})>"
