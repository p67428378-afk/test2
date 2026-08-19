from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from server.schemas.user import UserResponse


class RegistrationCreate(BaseModel):
    conference_id: str
    ticket_type: Optional[str] = "STANDARD"


class RegistrationResponse(BaseModel):
    id: str
    conference_id: str
    attendee_id: str
    ticket_type: str
    status: str
    registered_at: datetime
    attendee: Optional[UserResponse] = None

    class Config:
        from_attributes = True
