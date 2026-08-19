from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from server.schemas.user import UserResponse


class ConferenceBase(BaseModel):
    title: str
    description: Optional[str] = None
    location: str
    start_date: datetime
    end_date: datetime
    status: Optional[str] = "DRAFT"


class ConferenceCreate(ConferenceBase):
    pass


class ConferenceUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    status: Optional[str] = None


class ConferenceResponse(ConferenceBase):
    id: str
    organizer_id: str
    organizer: Optional[UserResponse] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
