from pydantic import BaseModel, Field
from typing import Optional
import uuid


# Existing Password Reset Schemas
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


# New Library Management System Schemas


# Auth
class LoginRequest(BaseModel):
    is_librarian: bool
    password: str
    username: str


class LoginResponse(BaseModel):
    access_token: str
    role: str
    token_type: str


# Books
class BookCreate(BaseModel):
    title: str
    author: str
    isbn: str
    category: str
    copies_total: int = Field(..., gte=1)


class BookUpdate(BaseModel):
    title: str
    author: str
    isbn: str
    category: str
    copies_total: int = Field(..., gte=1)


class BookResponse(BaseModel):
    id: uuid.UUID
    title: str
    author: str
    isbn: str
    category: str
    copies_total: int
    copies_available: int
    status: str

    class Config:
        from_attributes = True


# Patrons
class PatronCreate(BaseModel):
    username: str
    email: str
    password: str
    full_name: str
    mobile_number: Optional[str] = None


class PatronResponse(BaseModel):
    id: uuid.UUID
    username: str
    email: str
    full_name: str
    mobile_number: Optional[str] = None

    class Config:
        from_attributes = True


# Circulation
class CheckoutRequest(BaseModel):
    book_id: str
    due_date: str
    patron_id: str


class CheckoutResponse(BaseModel):
    id: uuid.UUID
    book_id: uuid.UUID
    patron_id: uuid.UUID
    checkout_date: str
    due_date: str
    status: str

    class Config:
        from_attributes = True


class CheckinRequest(BaseModel):
    book_id: str


class CheckinResponse(BaseModel):
    id: uuid.UUID
    book_id: uuid.UUID
    patron_id: uuid.UUID
    checkout_date: str
    due_date: str
    return_date: Optional[str] = None
    status: str

    class Config:
        from_attributes = True


# Reports
class CirculationReportResponse(BaseModel):
    active_loans: int
    overdue_loans: int
    total_loans: int
