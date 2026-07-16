from pydantic import BaseModel, Field, EmailStr
from uuid import UUID
from datetime import datetime
from typing import List, Optional


# Password Reset Schemas (Legacy)
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


# Book Schemas
class BookBase(BaseModel):
    title: str
    description: str
    price: float
    isbn: str
    cover_image_url: str
    stock_quantity: int
    format: str


class BookCreate(BookBase):
    pass


class BookUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    isbn: Optional[str] = None
    cover_image_url: Optional[str] = None
    stock_quantity: Optional[int] = None
    format: Optional[str] = None


class BookResponse(BookBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class BookCreateResponse(BaseModel):
    id: UUID
    title: str

    class Config:
        from_attributes = True


# Cart Schemas
class CartItemRequest(BaseModel):
    book_id: UUID
    quantity: int = Field(..., ge=1)


class CartItemResponse(BaseModel):
    book_id: UUID
    title: str
    cover_image_url: str
    price: float
    quantity: int
    subtotal: float


class CartResponse(BaseModel):
    items: List[CartItemResponse]
    total_amount: float


class CartActionResponse(BaseModel):
    message: str
    total_items: Optional[int] = None


# Order Schemas
class OrderCreateRequest(BaseModel):
    email: EmailStr
    shipping_name: str
    shipping_address: str
    payment_token: str


class OrderResponse(BaseModel):
    order_id: UUID
    status: str
    total_amount: float

    class Config:
        from_attributes = True
