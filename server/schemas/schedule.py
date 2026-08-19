from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel
from server.schemas.session import SessionResponse


class ScheduleSlot(BaseModel):
    session_id: str
    hall_name: str
    start_time: datetime
    end_time: datetime


class ScheduleCreate(BaseModel):
    conference_id: str
    slots: List[ScheduleSlot]


class ScheduleResponse(BaseModel):
    id: str
    conference_id: str
    session_id: str
    hall_name: str
    start_time: datetime
    end_time: datetime
    created_at: datetime
    session: Optional[SessionResponse] = None

    class Config:
        from_attributes = True
