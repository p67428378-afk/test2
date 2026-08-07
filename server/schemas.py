from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime
from uuid import UUID
import re


# Password Reset schemas
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


# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    user_id: Optional[str] = None


class LoginRequest(BaseModel):
    email: str
    password: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        if not re.match(r"[^@]+@[^@]+\.[^@]+", v):
            raise ValueError("Invalid email address format")
        return v


# User / Member schemas
class UserBase(BaseModel):
    email: str
    full_name: str
    phone: Optional[str] = None
    role: str = "member"
    membership_status: str = "ACTIVE"
    is_active: bool = True

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        if not re.match(r"[^@]+@[^@]+\.[^@]+", v):
            raise ValueError("Invalid email address format")
        return v


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    email: Optional[str] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None
    role: Optional[str] = None
    membership_status: Optional[str] = None
    is_active: Optional[bool] = None
    password: Optional[str] = None

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and not re.match(r"[^@]+@[^@]+\.[^@]+", v):
            raise ValueError("Invalid email address format")
        return v


class UserResponse(UserBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Book schemas
class BookBase(BaseModel):
    title: str
    author: str
    isbn: str
    category: Optional[str] = None
    genre: Optional[str] = None
    publication_year: Optional[int] = None
    total_copies: int = 1


class BookCreate(BookBase):
    pass


class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    isbn: Optional[str] = None
    category: Optional[str] = None
    genre: Optional[str] = None
    publication_year: Optional[int] = None
    total_copies: Optional[int] = None
    available_copies: Optional[int] = None
    is_active: Optional[bool] = None


class BookResponse(BookBase):
    id: UUID
    available_copies: int
    is_active: bool = True
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Loan schemas
class LoanCreate(BaseModel):
    book_id: UUID
    member_id: UUID


class LoanResponse(BaseModel):
    id: UUID
    book_id: UUID
    member_id: UUID
    checkout_date: Optional[datetime] = None
    borrowed_at: Optional[datetime] = None
    due_date: datetime
    return_date: Optional[datetime] = None
    returned_at: Optional[datetime] = None
    status: str = "BORROWED"
    reminder_48h_sent: bool = False
    reminder_24h_sent: bool = False
    created_at: datetime
    updated_at: datetime
    book: Optional[BookResponse] = None
    member: Optional[UserResponse] = None

    class Config:
        from_attributes = True


# Fine schemas
class FineResponse(BaseModel):
    id: UUID
    loan_id: UUID
    member_id: Optional[UUID] = None
    overdue_days: int = 0
    amount: float
    status: str
    paid_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    loan: Optional[LoanResponse] = None

    class Config:
        from_attributes = True


# Loan Return Response schema
class LoanReturnResponse(BaseModel):
    loan: LoanResponse
    fine: Optional[FineResponse] = None


# Inventory Item schemas
class InventoryItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    quantity: int = 0
    unit: str
    supplier: Optional[str] = None
    category: Optional[str] = None
    low_stock_threshold: int = 10

    @field_validator("quantity")
    @classmethod
    def validate_quantity(cls, v: int) -> int:
        if v < 0:
            raise ValueError("Quantity cannot be negative")
        return v

    @field_validator("low_stock_threshold")
    @classmethod
    def validate_threshold(cls, v: int) -> int:
        if v < 0:
            raise ValueError("Low stock threshold cannot be negative")
        return v


class InventoryItemCreate(InventoryItemBase):
    pass


class InventoryItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    quantity: Optional[int] = None
    unit: Optional[str] = None
    supplier: Optional[str] = None
    category: Optional[str] = None
    low_stock_threshold: Optional[int] = None

    @field_validator("quantity")
    @classmethod
    def validate_quantity(cls, v: Optional[int]) -> Optional[int]:
        if v is not None and v < 0:
            raise ValueError("Quantity cannot be negative")
        return v

    @field_validator("low_stock_threshold")
    @classmethod
    def validate_threshold(cls, v: Optional[int]) -> Optional[int]:
        if v is not None and v < 0:
            raise ValueError("Low stock threshold cannot be negative")
        return v


class InventoryItemResponse(InventoryItemBase):
    item_id: UUID
    created_at: datetime
    updated_at: datetime
    is_low_stock: bool = False

    class Config:
        from_attributes = True
