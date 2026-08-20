"""REST API endpoints for Digital Queue management."""

from typing import Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.schemas.queue import (
    QueueTicketCreate,
    QueueTicketStatusUpdate,
    QueueTicketResponse,
    QueueTicketListResponse,
)
from server.services.queue_service import QueueService

router = APIRouter(prefix="/api/v1/queue", tags=["queue"])


@router.post(
    "/tickets",
    response_model=QueueTicketResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Join Queue (Create Ticket)",
    description="Submit customer details to join the service queue and receive a unique sequential ticket.",
)
def join_queue(
    payload: QueueTicketCreate,
    db: Session = Depends(get_db),
) -> QueueTicketResponse:
    """Join service queue."""
    service = QueueService(db)
    return service.join_queue(
        customer_name=payload.customer_name,
        service_type=payload.service_type,
    )


@router.get(
    "/tickets/{ticket_id}",
    response_model=QueueTicketResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Ticket Position & Status",
    description="Retrieve current queue ticket status, live line position, and estimated wait time.",
)
def get_ticket(
    ticket_id: str,
    db: Session = Depends(get_db),
) -> QueueTicketResponse:
    """Get ticket by ID or ticket number."""
    service = QueueService(db)
    return service.get_ticket(ticket_id)


@router.get(
    "/tickets",
    response_model=QueueTicketListResponse,
    status_code=status.HTTP_200_OK,
    summary="List Queue Tickets",
    description="List active or historical queue tickets with optional status filtering.",
)
def list_tickets(
    status_filter: Optional[str] = Query(
        None,
        alias="status",
        description="Filter by status (Waiting, In Progress, Completed, Cancelled)",
    ),
    skip: int = Query(0, ge=0, description="Items to skip for pagination"),
    limit: int = Query(20, ge=1, le=100, description="Max items to return"),
    db: Session = Depends(get_db),
) -> QueueTicketListResponse:
    """List queue tickets."""
    service = QueueService(db)
    return service.list_tickets(status_filter=status_filter, skip=skip, limit=limit)


@router.patch(
    "/tickets/{ticket_id}/status",
    response_model=QueueTicketResponse,
    status_code=status.HTTP_200_OK,
    summary="Update Ticket Status",
    description="Transition ticket status (e.g. Call to counter, Complete, Cancel).",
)
def update_ticket_status(
    ticket_id: str,
    payload: QueueTicketStatusUpdate,
    db: Session = Depends(get_db),
) -> QueueTicketResponse:
    """Update status and counter assignment for a ticket."""
    service = QueueService(db)
    return service.update_ticket_status(
        ticket_id=ticket_id,
        new_status=payload.status,
        counter_number=payload.counter_number,
    )
