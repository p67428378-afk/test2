"""
Module: server.schemas.menu
Purpose: MenuItem schemas.
"""

from typing import Optional
from pydantic import BaseModel, ConfigDict


class MenuItemCreate(BaseModel):
    name: str
    price: float
    description: Optional[str] = None
    image_url: Optional[str] = None
    is_available: Optional[bool] = True


class MenuItemUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    is_available: Optional[bool] = None


class MenuItemResponse(BaseModel):
    id: str
    restaurant_id: str
    name: str
    description: Optional[str] = None
    price: float
    image_url: Optional[str] = None
    is_available: bool

    model_config = ConfigDict(from_attributes=True)
