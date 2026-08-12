"""
Module: schemas.stop
Purpose: Pydantic schemas for bus stop data and ETA predictions
"""

from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field


class StopCreate(BaseModel):
    name: str = Field(..., example="Central Station")
    address: Optional[str] = Field(None, example="123 Main St")
    latitude: float = Field(..., example=40.7128)
    longitude: float = Field(..., example=-74.0060)


class StopResponse(BaseModel):
    id: str
    name: str
    address: Optional[str] = None
    latitude: float
    longitude: float
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class StopETA(BaseModel):
    stop_id: str
    stop_name: str
    bus_id: str
    bus_number: str
    route_code: Optional[str] = None
    eta_minutes: int
    distance_miles: float
    speed_mph: float
    delay_status: str
    is_offline: bool
