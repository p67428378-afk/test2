"""
Module: server.schemas.restaurant
Purpose: Restaurant schemas.
"""

from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from server.schemas.menu import MenuItemResponse


class RestaurantCreate(BaseModel):
    name: str
    cuisine: str
    address: Optional[str] = None
    operating_hours: Optional[str] = None
    delivery_fee: Optional[float] = 0.0
    delivery_time: Optional[int] = 30


class RestaurantUpdate(BaseModel):
    name: Optional[str] = None
    cuisine: Optional[str] = None
    address: Optional[str] = None
    operating_hours: Optional[str] = None
    delivery_fee: Optional[float] = None
    delivery_time: Optional[int] = None


class RestaurantResponse(BaseModel):
    id: str
    owner_id: str
    name: str
    cuisine: str
    rating: float
    delivery_time: int
    delivery_fee: float
    operating_hours: Optional[str] = None
    address: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class RestaurantDetailResponse(RestaurantResponse):
    menu_items: List[MenuItemResponse] = []

    model_config = ConfigDict(from_attributes=True)
