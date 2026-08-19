from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from server.schemas.user import UserResponse


class CheckInRequest(BaseModel):
    session_id: str
    attendee_id: str


class AttendanceLogResponse(BaseModel):
    id: str
    session_id: str
    attendee_id: str
    checked_in_at: datetime
    checked_in_by: str
    attendee: Optional[UserResponse] = None

    class Config:
        from_attributes = True
