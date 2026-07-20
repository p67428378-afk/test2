import uuid
from datetime import datetime
from pydantic import BaseModel, Field, field_validator
from typing import Optional, List


# Existing schemas
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


# Book schemas
class BookBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    author: str = Field(..., min_length=1, max_length=255)
    isbn: str = Field(..., description="13-digit ISBN")
    published_year: Optional[int] = None
    genre: Optional[str] = Field(None, max_length=100)
    total_copies: int = Field(5, ge=0)
    available_copies: int = Field(5, ge=0)
    cover_image_url: Optional[str] = Field(None, max_length=500)

    @field_validator("isbn")
    @classmethod
    def validate_isbn(cls, v: str) -> str:
        # Strip hyphens and spaces
        cleaned = v.replace("-", "").replace(" ", "")
        if len(cleaned) != 13 or not cleaned.isdigit():
            raise ValueError("ISBN must be a 13-digit number")
        return cleaned


class BookCreate(BookBase):
    pass


class BookResponse(BaseModel):
    id: uuid.UUID
    title: str
    author: str
    isbn: str
    published_year: Optional[int] = None
    genre: Optional[str] = None
    total_copies: int
    available_copies: int
    is_available: bool
    cover_image_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class BookSearchResponse(BaseModel):
    items: List[BookResponse]
    total: int
    page: int
    limit: int
    pages: int
