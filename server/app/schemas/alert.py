"""
Module: schemas.alert
Purpose: Pydantic schemas for proximity and arrival alert subscriptions
"""

from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field


class AlertCreate(BaseModel):
    stop_id: str = Field(..., example="stop-uuid-123")
    bus_id: Optional[str] = Field(None, example="bus-uuid-456")
    threshold_minutes: Optional[int] = Field(5, example=5)
    threshold_distance_miles: Optional[float] = Field(1.0, example=1.0)


class AlertResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    bus_id: Optional[str] = None
    stop_id: str
    threshold_minutes: int
    threshold_distance_miles: float
    is_active: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
