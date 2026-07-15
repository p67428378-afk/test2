from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from uuid import UUID
from datetime import datetime


class ProductBase(BaseModel):
    name: str
    price: float
    image_url: Optional[str] = None
    stock_quantity: int


class ProductCreate(ProductBase):
    pass


class ProductResponse(ProductBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CartItemAdd(BaseModel):
    product_id: UUID
    quantity: int = Field(..., ge=1)


class CartItemResponse(BaseModel):
    product_id: UUID
    name: str
    price: float
    quantity: int
    subtotal: float


class CartResponse(BaseModel):
    cart_id: UUID
    items: List[CartItemResponse]
    total_price: float


class ShippingAddress(BaseModel):
    name: str
    email: EmailStr
    address: str
    city: str
    state: str
    zip: str


class PaymentDetails(BaseModel):
    card_number: str
    cardholder_name: str
    expiry: str
    cvc: str


class OrderCreate(BaseModel):
    cart_id: UUID
    shipping_address: ShippingAddress
    payment_details: PaymentDetails


class OrderResponse(BaseModel):
    order_id: UUID
    total_price: float
    payment_status: str
    created_at: datetime
