from typing import Optional, Any
from datetime import datetime
from pydantic import BaseModel, Field


class MediaCreate(BaseModel):
    entity_type: str = Field(..., min_length=1, max_length=50)
    entity_id: str
    title: Optional[str] = None
    file_url: str
    file_type: Optional[str] = None
    caption: Optional[str] = None
    camera_metadata: Optional[Any] = None


class MediaResponse(MediaCreate):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
