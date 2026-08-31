from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field


# ==========================================
# Chocolate Schemas
# ==========================================


class ChocolateBase(BaseModel):
    title: str
    description: Optional[str] = None
    cocoa_percentage: int = Field(..., ge=50, le=100)
    origin_region: str
    flavor_notes: str
    dietary_flags: str
    price: float = Field(..., gt=0)
    stock_quantity: int = Field(default=0, ge=0)
    is_heat_sensitive: bool = True


class ChocolateCreate(ChocolateBase):
    pass


class ChocolateResponse(ChocolateBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ==========================================
# Cart Schemas
# ==========================================


class CartItemBase(BaseModel):
    chocolate_id: str
    quantity: int = Field(default=1, ge=1)


class CartItemCreate(BaseModel):
    cart_id: Optional[str] = None
    chocolate_id: str
    quantity: int = Field(default=1, ge=1)


class CartItemUpdate(BaseModel):
    quantity: int = Field(..., ge=1)


class CartItemResponse(BaseModel):
    id: str
    cart_id: str
    chocolate_id: str
    quantity: int
    item_subtotal: Optional[float] = None
    chocolate: Optional[ChocolateResponse] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CartResponse(BaseModel):
    id: str
    cart_id: str
    session_token: str
    items: List[CartItemResponse] = []
    subtotal: float = 0.0
    updated_items_count: int = 0
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ==========================================
# Order Schemas
# ==========================================


class OrderItemResponse(BaseModel):
    id: str
    order_id: str
    chocolate_id: str
    unit_price: float
    quantity: int
    item_subtotal: Optional[float] = None
    chocolate: Optional[ChocolateResponse] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class OrderCreate(BaseModel):
    cart_id: str
    customer_name: str = Field(..., min_length=1)
    customer_email: EmailStr
    shipping_address: str = Field(..., min_length=5)
    shipping_method: str = Field(default="standard_ground")


class OrderResponse(BaseModel):
    id: str
    order_id: str
    order_code: str
    customer_name: str
    customer_email: str
    shipping_address: str
    shipping_method: str
    shipping_fee: float
    subtotal_amount: float
    total_amount: float
    order_status: str
    status: str
    items: List[OrderItemResponse] = []
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ==========================================
# Common / Health Schemas
# ==========================================


class HealthResponse(BaseModel):
    status: str
    database: str
