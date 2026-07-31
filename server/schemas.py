from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime
from uuid import UUID
import re


# Existing Password Reset schemas
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


# Library Management System schemas


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


# User schemas
class UserBase(BaseModel):
    email: str
    full_name: str
    role: str = "member"

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
    role: Optional[str] = None
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
    genre: Optional[str] = None
    publication_year: Optional[int] = None
    total_copies: int = 1


class BookCreate(BookBase):
    pass


class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    isbn: Optional[str] = None
    genre: Optional[str] = None
    publication_year: Optional[int] = None
    total_copies: Optional[int] = None
    available_copies: Optional[int] = None


class BookResponse(BookBase):
    id: UUID
    available_copies: int
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
    checkout_date: datetime
    due_date: datetime
    return_date: Optional[datetime] = None
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
    amount: float
    status: str
    created_at: datetime
    updated_at: datetime
    loan: Optional[LoanResponse] = None

    class Config:
        from_attributes = True
