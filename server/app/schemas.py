"""
Module: schemas
Purpose: Pydantic schemas for request/response validation and serialization.
"""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel


# --- Auth Schemas ---
class UserRegister(BaseModel):
    email: str
    name: str
    password: str


class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    created_at: datetime

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: str
    password: str


class UserLoginResponseDetails(BaseModel):
    id: str
    email: str
    name: str
    role: str

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserLoginResponseDetails


# --- Category Schemas ---
class CategoryBase(BaseModel):
    id: str
    name: str
    parent_id: Optional[str] = None


class CategoryResponse(CategoryBase):
    subcategories: List["CategoryResponse"] = []

    class Config:
        from_attributes = True


# Resolve circular reference for CategoryResponse
CategoryResponse.model_rebuild()


# --- Product Schemas ---
class ProductBase(BaseModel):
    id: str
    name: str
    description: str
    price: float
    image_url: str
    stock: int
    category_id: str
    brand: str
    size: str
    color: str
    rating: Optional[float] = None

    class Config:
        from_attributes = True


class ProductListResponse(BaseModel):
    items: List[ProductBase]
    total: int
    suggestions: List[ProductBase] = []  # AC 11: Suggestions for other products


class ReviewResponse(BaseModel):
    id: str
    user_name: str
    rating: int
    comment: str
    created_at: datetime

    class Config:
        from_attributes = True


class ProductDetailResponse(ProductBase):
    reviews: List[ReviewResponse] = []
    images: List[str] = []  # AC 3: Multiple images support

    class Config:
        from_attributes = True


# --- Wishlist Schemas ---
class WishlistAddRequest(BaseModel):
    product_id: str


class WishlistItemResponse(BaseModel):
    product_id: str
    name: str
    price: float
    image_url: str

    class Config:
        from_attributes = True


class WishlistActionResponse(BaseModel):
    status: str
    message: str


# --- Cart Schemas ---
class CartAddRequest(BaseModel):
    product_id: str
    quantity: int


class CartItemResponse(BaseModel):
    product_id: str
    name: str
    price: float
    image_url: str
    quantity: int

    class Config:
        from_attributes = True


class CartResponse(BaseModel):
    items: List[CartItemResponse]
    total_price: float


class CartActionResponse(BaseModel):
    status: str
    message: str


# --- Order Schemas ---
class OrderCreateRequest(BaseModel):
    coupon_code: Optional[str] = None
    payment_method: str
    shipping_address: str


class OrderResponse(BaseModel):
    id: str
    user_id: str
    status: str
    total_price: float
    created_at: datetime

    class Config:
        from_attributes = True


class OrderItemResponse(BaseModel):
    product_id: str
    name: str
    price: float
    quantity: int

    class Config:
        from_attributes = True


class OrderDetailResponse(BaseModel):
    id: str
    user_id: str
    status: str
    total_price: float
    shipping_address: str
    payment_method: str
    created_at: datetime
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True


# --- Admin Schemas ---
class AdminMetricsResponse(BaseModel):
    active_customers: int
    low_stock_count: int
    total_orders: int
    total_sales: float


class AdminOrderResponse(BaseModel):
    id: str
    customer_name: str
    status: str
    total_price: float
    created_at: datetime

    class Config:
        from_attributes = True
