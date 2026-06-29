"""
Module: server.schemas.delivery
Purpose: Delivery schemas.
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class DeliveryLocationUpdate(BaseModel):
    latitude: float
    longitude: float


class DeliveryResponse(BaseModel):
    id: str
    order_id: str
    driver_id: Optional[str] = None
    status: str
    current_latitude: Optional[float] = None
    current_longitude: Optional[float] = None
    earnings: float
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
