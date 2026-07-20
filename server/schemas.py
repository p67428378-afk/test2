from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from uuid import UUID


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


class BookCreate(BaseModel):
    title: str
    author: str
    isbn: str
    published_year: Optional[int] = None
    genre: Optional[str] = None
    total_copies: int = 1
    available_copies: int = 1
    cover_image_url: Optional[str] = None


class BookResponse(BaseModel):
    id: UUID
    title: str
    author: str
    isbn: str
    published_year: Optional[int]
    genre: Optional[str]
    total_copies: int
    available_copies: int
    is_available: bool
    cover_image_url: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
        from_attributes = True


class BookSearchItem(BaseModel):
    id: UUID
    title: str
    author: str
    isbn: str
    published_year: Optional[int]
    genre: Optional[str]
    total_copies: int
    available_copies: int
    is_available: bool
    cover_image_url: Optional[str]

    class Config:
        orm_mode = True
        from_attributes = True


class BookSearchResponse(BaseModel):
    items: List[BookSearchItem]
    total: int
    page: int
    pages: int
    limit: int
