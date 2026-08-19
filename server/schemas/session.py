from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from server.schemas.user import UserResponse


class SessionBase(BaseModel):
    conference_id: str
    title: str
    abstract: str
    track: str


class SessionCreate(SessionBase):
    pass


class SessionUpdate(BaseModel):
    title: Optional[str] = None
    abstract: Optional[str] = None
    track: Optional[str] = None
    status: Optional[str] = None


class SessionResponse(SessionBase):
    id: str
    speaker_id: str
    status: str
    speaker: Optional[UserResponse] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
