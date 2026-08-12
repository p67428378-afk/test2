from typing import Optional, List, Any, Dict
from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime
from decimal import Decimal


# --- Painting Schemas ---
class PaintingBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    artist_name: Optional[str] = None
    medium: Optional[str] = None
    style: Optional[str] = None
    base_price: Decimal = Field(..., ge=0)
    is_configurable: bool = False
    is_original_one_of_one: bool = False
    stock_quantity: int = Field(default=1, ge=0)
    image_url: Optional[str] = None
    status: str = Field(default="ACTIVE")


class PaintingCreate(PaintingBase):
    pass


class PaintingUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    artist_name: Optional[str] = None
    medium: Optional[str] = None
    style: Optional[str] = None
    base_price: Optional[Decimal] = None
    is_configurable: Optional[bool] = None
    is_original_one_of_one: Optional[bool] = None
    stock_quantity: Optional[int] = None
    image_url: Optional[str] = None
    status: Optional[str] = None


class PaintingOut(PaintingBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PaintingListResponse(BaseModel):
    items: List[PaintingOut]
    total: int
    skip: int
    limit: int
    suggestions: Optional[List[PaintingOut]] = None


# --- Frame Option Schemas ---
class FrameOptionBase(BaseModel):
    name: str
    material: Optional[str] = None
    price_multiplier: Decimal = Decimal("1.0000")
    flat_fee: Decimal = Decimal("0.0000")


class FrameOptionCreate(FrameOptionBase):
    pass


class FrameOptionOut(FrameOptionBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# --- Configurator Schemas ---
class PriceCalculationRequest(BaseModel):
    painting_id: UUID
    custom_width_inches: Optional[Decimal] = Field(
        None, description="Width in inches (12-120)"
    )
    custom_height_inches: Optional[Decimal] = Field(
        None, description="Height in inches (12-120)"
    )
    frame_option_id: Optional[UUID] = None


class PriceCalculationResponse(BaseModel):
    painting_id: UUID
    base_price: Decimal
    custom_width_inches: Optional[Decimal] = None
    custom_height_inches: Optional[Decimal] = None
    area_sq_inches: Optional[Decimal] = None
    dimension_multiplier: Decimal = Decimal("1.0")
    frame_fee: Decimal = Decimal("0.0")
    calculated_unit_price: Decimal
    is_valid: bool = True
    validation_error: Optional[str] = None


# --- Cart Schemas ---
class CartItemAddRequest(BaseModel):
    cart_id: str
    painting_id: UUID
    frame_option_id: Optional[UUID] = None
    custom_width_inches: Optional[Decimal] = None
    custom_height_inches: Optional[Decimal] = None
    quantity: int = Field(default=1, ge=1)


class CartItemOut(BaseModel):
    id: UUID
    cart_id: str
    painting_id: UUID
    painting_title: Optional[str] = None
    painting_image_url: Optional[str] = None
    frame_option_id: Optional[UUID] = None
    frame_name: Optional[str] = None
    custom_width_inches: Optional[Decimal] = None
    custom_height_inches: Optional[Decimal] = None
    unit_price: Decimal
    quantity: int
    total_price: Decimal

    class Config:
        from_attributes = True


class CartResponse(BaseModel):
    cart_id: str
    items: List[CartItemOut]
    subtotal: Decimal
    total_items: int


# --- Checkout & Order Schemas ---
class ShippingAddress(BaseModel):
    full_name: Optional[str] = "Valued Customer"
    address_line1: Optional[str] = None
    street: Optional[str] = None
    address_line2: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    zip: Optional[str] = None
    country: Optional[str] = "US"

    class Config:
        extra = "allow"


class CheckoutIntentRequest(BaseModel):
    cart_id: str
    customer_email: str
    shipping_address: Dict[str, Any]
    promo_code: Optional[str] = None


class CheckoutIntentResponse(BaseModel):
    order_id: UUID
    order_number: str
    customer_email: str
    subtotal: Decimal
    shipping_fee: Decimal
    tax_amount: Decimal
    total_amount: Decimal
    status: str
    payment_intent_id: str
    client_secret: Optional[str] = None
    message: str


class OrderStatusUpdate(BaseModel):
    status: str = Field(
        ..., description="Order Placed, In Production, Shipped, Delivered, Cancelled"
    )
    tracking_number: Optional[str] = None


class OrderOut(BaseModel):
    id: UUID
    order_number: str
    customer_email: str
    shipping_address: Dict[str, Any]
    subtotal: Decimal
    shipping_fee: Decimal
    tax_amount: Decimal
    total_amount: Decimal
    status: str
    tracking_number: Optional[str] = None
    items: Optional[List[Dict[str, Any]]] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
