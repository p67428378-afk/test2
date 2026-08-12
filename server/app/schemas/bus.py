"""
Module: schemas.bus
Purpose: Pydantic schemas for bus vehicle fleet and telemetry ingestion
"""

from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field


class BusCreate(BaseModel):
    bus_number: str = Field(..., example="BUS-42")
    route_id: Optional[str] = None
    driver_id: Optional[str] = None
    latitude: Optional[float] = 0.0
    longitude: Optional[float] = 0.0
    speed_mph: Optional[float] = 0.0
    status: Optional[str] = "active"


class BusUpdate(BaseModel):
    route_id: Optional[str] = None
    driver_id: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    speed_mph: Optional[float] = None
    status: Optional[str] = None


class TelemetryIngest(BaseModel):
    bus_id: Optional[str] = Field(None, example="bus-uuid-123")
    bus_number: Optional[str] = Field(None, example="BUS-42")
    latitude: float = Field(..., example=40.7128)
    longitude: float = Field(..., example=-74.0060)
    speed_mph: Optional[float] = Field(25.0, example=25.0)


class BusResponse(BaseModel):
    id: str
    bus_number: str
    route_id: Optional[str] = None
    driver_id: Optional[str] = None
    latitude: float
    longitude: float
    speed_mph: float
    status: str
    last_telemetry_at: Optional[datetime] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
