"""Schemas package."""

from server.schemas.queue import (
    QueueTicketCreate,
    QueueTicketStatusUpdate,
    QueueTicketResponse,
    QueueTicketListResponse,
)

__all__ = [
    "QueueTicketCreate",
    "QueueTicketStatusUpdate",
    "QueueTicketResponse",
    "QueueTicketListResponse",
]
