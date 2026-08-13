from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from decimal import Decimal


# Painting Schemas
class PaintingBase(BaseModel):
    title: str
    description: Optional[str] = None
    artist_name: str
    image_url: str
    dimensions: Optional[str] = None
    price: Decimal
    stock: int = 1


class PaintingCreate(PaintingBase):
    pass


class PaintingUpdate(PaintingBase):
    pass


class PaintingResponse(PaintingBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PaintingListResponse(BaseModel):
    items: List[PaintingResponse]
    page: int
    pages: int
    total: int


# Cart Schemas
class CartItemCreate(BaseModel):
    painting_id: str


class CartItemResponse(BaseModel):
    id: str
    painting_id: str
    title: str
    image_url: str
    price: Decimal
    quantity: int


class CartResponse(BaseModel):
    items: List[CartItemResponse]
    subtotal: Decimal
    total: Decimal


class CartItemAddResponse(BaseModel):
    item: CartItemResponse
    message: str


# Checkout Schemas
class ShippingAddress(BaseModel):
    full_name: str
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: str
    postal_code: str
    country: str


class CheckoutRequest(BaseModel):
    payment_method_id: str
    shipping_address: ShippingAddress


class CheckoutResponse(BaseModel):
    client_secret: str
    order_id: str
    status: str
    total_amount: Decimal


# Order Schemas
class OrderItemResponse(BaseModel):
    id: str
    painting_id: str
    title: str
    price: Decimal
    quantity: int


class OrderResponse(BaseModel):
    id: str
    total_amount: Decimal
    status: str
    created_at: datetime
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True


# Webhook Schemas
class WebhookRequest(BaseModel):
    id: str
    type: str
    data: dict
