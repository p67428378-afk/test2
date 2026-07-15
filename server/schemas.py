from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime
from uuid import UUID


# User Schemas
class UserRegister(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    user_id: UUID
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


# Product Schemas
class ProductResponse(BaseModel):
    product_id: UUID
    name: str
    description: Optional[str] = None
    price: float
    image_urls: List[str]
    category: str
    rating: float
    review_count: int
    tags: List[str]

    class Config:
        from_attributes = True


# Cart Schemas
class CartItemRequest(BaseModel):
    product_id: UUID
    quantity: int = Field(..., ge=0)


class CartItemResponse(BaseModel):
    product_id: UUID
    name: str
    price: float
    quantity: int
    image_url: str


class CartResponse(BaseModel):
    cart_id: UUID
    items: List[CartItemResponse]
    subtotal: float


# Order Schemas
class OrderCreateRequest(BaseModel):
    payment_method_id: str
    shipping_address: str


class OrderItemResponse(BaseModel):
    product_id: UUID
    name: str
    price: float
    quantity: int


class OrderResponse(BaseModel):
    order_id: UUID
    total_amount: float
    status: str
    created_at: datetime
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True


# Legacy Password Reset Schemas for compatibility
class PasswordResetInitiateRequest(BaseModel):
    login_id: str
    mobile_number: str


class PasswordResetInitiateResponse(BaseModel):
    otp_session_id: str
    security_question: str


class OTPVerifyRequest(BaseModel):
    otp_code: str
    otp_session_id: str


class OTPVerifyResponse(BaseModel):
    security_question_session_id: str


class SecurityQuestionVerifyRequest(BaseModel):
    answer: str
    security_question_session_id: str


class SecurityQuestionVerifyResponse(BaseModel):
    password_reset_session_id: str


class SetNewPasswordRequest(BaseModel):
    new_password: str
    password_reset_session_id: str


class SetNewPasswordResponse(BaseModel):
    status: str
    login_link: str
