"""
Module: server.schemas.order
Purpose: Order and OrderItem schemas.
"""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class OrderItemCreate(BaseModel):
    menu_item_id: str
    quantity: int


class OrderCreate(BaseModel):
    restaurant_id: str
    delivery_address: str
    items: List[OrderItemCreate]


class OrderItemResponse(BaseModel):
    id: str
    menu_item_id: str
    name: str
    price: float
    quantity: int

    model_config = ConfigDict(from_attributes=True)


class OrderResponse(BaseModel):
    id: str
    user_id: str
    restaurant_id: str
    status: str
    total_amount: float
    delivery_address: str
    payment_status: str
    rating: Optional[float] = None
    feedback: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class OrderDetailResponse(OrderResponse):
    items: List[OrderItemResponse] = []

    model_config = ConfigDict(from_attributes=True)


class OrderStatusUpdate(BaseModel):
    status: str


class OrderListResponse(BaseModel):
    id: str
    restaurant_name: str
    status: str
    total_amount: float
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class OrderFeedbackSubmit(BaseModel):
    rating: float
    feedback: Optional[str] = None
