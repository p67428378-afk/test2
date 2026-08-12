"""
Module: schemas.route
Purpose: Pydantic schemas for transit routes
"""

from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field
from server.app.schemas.stop import StopResponse
from server.app.schemas.bus import BusResponse


class RouteCreate(BaseModel):
    name: str = Field(..., example="Route 101 - Downtown Express")
    code: str = Field(..., example="101")
    description: Optional[str] = Field(
        None, example="Connects North Station to Downtown"
    )
    path_coordinates: Optional[List[List[float]]] = Field(
        None, example=[[40.7128, -74.0060], [40.7138, -74.0050]]
    )
    stop_ids: Optional[List[str]] = Field(None, description="Ordered list of stop IDs")


class RouteUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    path_coordinates: Optional[List[List[float]]] = None
    is_active: Optional[bool] = None
    stop_ids: Optional[List[str]] = None


class RouteResponse(BaseModel):
    id: str
    name: str
    code: str
    description: Optional[str] = None
    path_coordinates: Optional[List[List[float]]] = None
    is_active: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class RouteDetailResponse(RouteResponse):
    stops: List[StopResponse] = []
    active_buses: List[BusResponse] = []
