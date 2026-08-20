"""Business logic service for Queue management."""

from typing import Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from server.repositories.queue_repository import QueueRepository
from server.schemas.queue import (
    QueueTicketResponse,
    QueueTicketListResponse,
)


class QueueService:
    """Service encapsulating queue business logic."""

    VALID_TRANSITIONS = {
        "Waiting": {"Waiting", "In Progress", "Cancelled"},
        "In Progress": {"In Progress", "Completed", "Cancelled"},
        "Completed": {"Completed"},
        "Cancelled": {"Cancelled"},
    }

    def __init__(self, db: Session):
        self.repo = QueueRepository(db)

    def join_queue(self, customer_name: str, service_type: str) -> QueueTicketResponse:
        """Process customer request to join queue and receive ticket."""
        ticket = self.repo.create_ticket(
            customer_name=customer_name, service_type=service_type
        )
        position, wait_time = self.repo.calculate_position_and_wait(ticket)

        return QueueTicketResponse(
            ticket_id=ticket.id,
            ticket_number=ticket.ticket_number,
            customer_name=ticket.customer_name,
            service_type=ticket.service_type,
            status=ticket.status,
            counter_number=ticket.counter_number,
            position_in_line=position,
            estimated_wait_minutes=wait_time,
            created_at=ticket.created_at,
            updated_at=ticket.updated_at,
        )

    def get_ticket(self, ticket_id: str) -> QueueTicketResponse:
        """Fetch ticket by ID or ticket number and return current position & status."""
        ticket = self.repo.get_by_id(ticket_id)
        if not ticket:
            # Fallback check if user passed human readable ticket_number like 'Q-101'
            ticket = self.repo.get_by_number(ticket_id)

        if not ticket:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Queue ticket with ID '{ticket_id}' not found.",
            )

        position, wait_time = self.repo.calculate_position_and_wait(ticket)

        return QueueTicketResponse(
            ticket_id=ticket.id,
            ticket_number=ticket.ticket_number,
            customer_name=ticket.customer_name,
            service_type=ticket.service_type,
            status=ticket.status,
            counter_number=ticket.counter_number,
            position_in_line=position,
            estimated_wait_minutes=wait_time,
            created_at=ticket.created_at,
            updated_at=ticket.updated_at,
        )

    def list_tickets(
        self,
        status_filter: Optional[str] = None,
        skip: int = 0,
        limit: int = 20,
    ) -> QueueTicketListResponse:
        """List queue tickets with calculated positions."""
        tickets, total = self.repo.list_tickets(
            status=status_filter, skip=skip, limit=limit
        )

        response_items = []
        for t in tickets:
            pos, wait = self.repo.calculate_position_and_wait(t)
            response_items.append(
                QueueTicketResponse(
                    ticket_id=t.id,
                    ticket_number=t.ticket_number,
                    customer_name=t.customer_name,
                    service_type=t.service_type,
                    status=t.status,
                    counter_number=t.counter_number,
                    position_in_line=pos,
                    estimated_wait_minutes=wait,
                    created_at=t.created_at,
                    updated_at=t.updated_at,
                )
            )

        return QueueTicketListResponse(
            items=response_items,
            total=total,
            skip=skip,
            limit=limit,
        )

    def update_ticket_status(
        self,
        ticket_id: str,
        new_status: str,
        counter_number: Optional[str] = None,
    ) -> QueueTicketResponse:
        """Validate and apply status transition for a ticket."""
        ticket = self.repo.get_by_id(ticket_id)
        if not ticket:
            ticket = self.repo.get_by_number(ticket_id)

        if not ticket:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Queue ticket with ID '{ticket_id}' not found.",
            )

        current_status = ticket.status
        allowed = self.VALID_TRANSITIONS.get(current_status, set())
        if new_status not in allowed:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot transition ticket status from '{current_status}' to '{new_status}'.",
            )

        updated_ticket = self.repo.update_status(
            ticket=ticket,
            new_status=new_status,
            counter_number=counter_number,
        )

        position, wait_time = self.repo.calculate_position_and_wait(updated_ticket)

        return QueueTicketResponse(
            ticket_id=updated_ticket.id,
            ticket_number=updated_ticket.ticket_number,
            customer_name=updated_ticket.customer_name,
            service_type=updated_ticket.service_type,
            status=updated_ticket.status,
            counter_number=updated_ticket.counter_number,
            position_in_line=position,
            estimated_wait_minutes=wait_time,
            created_at=updated_ticket.created_at,
            updated_at=updated_ticket.updated_at,
        )
