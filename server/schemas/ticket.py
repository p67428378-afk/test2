"""
Module: server.schemas.ticket
Purpose: SupportTicket schemas.
"""

from datetime import datetime
from pydantic import BaseModel, ConfigDict


class TicketCreate(BaseModel):
    issue_type: str
    description: str


class TicketResponse(BaseModel):
    id: str
    user_id: str
    user_name: str
    issue_type: str
    description: str
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
