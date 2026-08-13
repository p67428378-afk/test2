from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from server.models.tanker import TankerStatus


class TankerCreate(BaseModel):
    registration_number: str = Field(..., example="TK-1001")
    capacity_liters: int = Field(..., example=5000)
    status: Optional[TankerStatus] = TankerStatus.AVAILABLE


class TankerResponse(BaseModel):
    id: str
    registration_number: str
    capacity_liters: int
    status: TankerStatus
    created_at: datetime

    class Config:
        from_attributes = True
