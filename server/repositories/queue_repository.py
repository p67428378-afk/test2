"""Database repository for Queue Tickets operations."""

from typing import Optional, List, Tuple
from sqlalchemy import func
from sqlalchemy.orm import Session
from server.models.queue import QueueTicket, utc_now


class QueueRepository:
    """Encapsulates database operations for Queue Tickets."""

    def __init__(self, db: Session):
        self.db = db

    def get_next_sequence_number(self) -> int:
        """Get next sequence number for ticket generation."""
        max_seq = self.db.query(func.max(QueueTicket.sequence_num)).scalar()
        if max_seq is None or max_seq < 100:
            return 101
        return max_seq + 1

    def create_ticket(self, customer_name: str, service_type: str) -> QueueTicket:
        """Create a new queue ticket with sequential ticket number."""
        next_seq = self.get_next_sequence_number()
        ticket_number = f"Q-{next_seq}"
        now = utc_now()

        ticket = QueueTicket(
            ticket_number=ticket_number,
            sequence_num=next_seq,
            customer_name=customer_name,
            service_type=service_type,
            status="Waiting",
            created_at=now,
            updated_at=now,
        )
        self.db.add(ticket)
        self.db.commit()
        self.db.refresh(ticket)
        return ticket

    def get_by_id(self, ticket_id: str) -> Optional[QueueTicket]:
        """Fetch queue ticket by UUID string ID."""
        return self.db.query(QueueTicket).filter(QueueTicket.id == ticket_id).first()

    def get_by_number(self, ticket_number: str) -> Optional[QueueTicket]:
        """Fetch queue ticket by human readable ticket number (e.g. Q-101)."""
        return (
            self.db.query(QueueTicket)
            .filter(QueueTicket.ticket_number == ticket_number)
            .first()
        )

    def count_waiting_ahead(self, ticket: QueueTicket) -> int:
        """Count number of tickets ahead in line with status 'Waiting'."""
        if ticket.status != "Waiting":
            return 0

        ahead_count = (
            self.db.query(func.count(QueueTicket.id))
            .filter(
                QueueTicket.status == "Waiting",
                QueueTicket.id != ticket.id,
                QueueTicket.sequence_num < ticket.sequence_num,
            )
            .scalar()
        )
        return ahead_count or 0

    def calculate_position_and_wait(
        self, ticket: QueueTicket, avg_service_minutes: int = 5
    ) -> Tuple[int, int]:
        """
        Calculate position in line and estimated wait time in minutes.
        For status 'Waiting': position = count_ahead + 1, wait = position * avg_service_minutes.
        For other statuses ('In Progress', 'Completed', 'Cancelled'): position = 0, wait = 0.
        """
        if ticket.status != "Waiting":
            return 0, 0

        ahead_count = self.count_waiting_ahead(ticket)
        position = ahead_count + 1
        estimated_wait = position * avg_service_minutes
        return position, estimated_wait

    def list_tickets(
        self,
        status: Optional[str] = None,
        skip: int = 0,
        limit: int = 20,
    ) -> Tuple[List[QueueTicket], int]:
        """Fetch list of tickets with optional status filtering and pagination."""
        query = self.db.query(QueueTicket)
        if status:
            query = query.filter(QueueTicket.status == status)

        total = query.count()
        items = (
            query.order_by(QueueTicket.sequence_num.asc())
            .offset(skip)
            .limit(limit)
            .all()
        )
        return items, total

    def update_status(
        self,
        ticket: QueueTicket,
        new_status: str,
        counter_number: Optional[str] = None,
    ) -> QueueTicket:
        """Update status and counter number for a ticket."""
        ticket.status = new_status
        if counter_number is not None:
            ticket.counter_number = counter_number
        ticket.updated_at = utc_now()
        self.db.commit()
        self.db.refresh(ticket)
        return ticket
