"""Pydantic schemas for Queue API request and response models."""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, field_validator


class QueueTicketCreate(BaseModel):
    """Payload for creating a new queue ticket."""

    customer_name: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Name of the customer joining queue",
    )
    service_type: str = Field(
        ..., min_length=1, max_length=50, description="Service category requested"
    )

    @field_validator("customer_name", "service_type")
    @classmethod
    def strip_and_validate_non_empty(cls, value: str) -> str:
        """Strip whitespace and ensure string is not blank."""
        stripped = value.strip()
        if not stripped:
            raise ValueError("Field cannot be empty or whitespace only.")
        return stripped


class QueueTicketStatusUpdate(BaseModel):
    """Payload for updating a ticket status and counter assignment."""

    status: str = Field(
        ..., description="Target status (Waiting, In Progress, Completed, Cancelled)"
    )
    counter_number: Optional[str] = Field(
        None, max_length=30, description="Assigned counter number"
    )

    @field_validator("status")
    @classmethod
    def validate_status(cls, value: str) -> str:
        """Validate status value."""
        valid_statuses = {"Waiting", "In Progress", "Completed", "Cancelled"}
        if value not in valid_statuses:
            raise ValueError(
                f"Invalid status '{value}'. Allowed: {', '.join(sorted(valid_statuses))}"
            )
        return value


class QueueTicketResponse(BaseModel):
    """Response model for a queue ticket with position and wait time."""

    ticket_id: str
    ticket_number: str
    customer_name: str
    service_type: str
    status: str
    counter_number: Optional[str] = None
    position_in_line: int = 0
    estimated_wait_minutes: int = 0
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class QueueTicketListResponse(BaseModel):
    """Paginated response model for listing queue tickets."""

    items: List[QueueTicketResponse]
    total: int
    skip: int
    limit: int
