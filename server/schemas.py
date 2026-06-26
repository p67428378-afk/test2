from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date


# --- Legacy Schemas for Password Reset ---
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


# --- Library Management System Schemas ---


class UserRegisterRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: str = Field(..., min_length=3, max_length=255)
    password: str = Field(..., min_length=6)
    role: str = Field(..., pattern="^(member|librarian)$")


class UserRegisterResponse(BaseModel):
    id: str
    username: str
    email: str
    role: str
    created_at: str

    class Config:
        from_attributes = True


class UserLoginRequest(BaseModel):
    username: str
    password: str


class UserLoginUserDetail(BaseModel):
    id: str
    username: str
    email: str
    role: str

    class Config:
        from_attributes = True


class UserLoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserLoginUserDetail


class BookCreateRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    author: str = Field(..., min_length=1, max_length=255)
    isbn: str = Field(..., min_length=1, max_length=50)
    published_date: Optional[date] = None
    initial_copies: int = Field(..., ge=1)


class BookResponse(BaseModel):
    id: str
    title: str
    author: str
    isbn: str
    published_date: Optional[str] = None
    total_copies: int
    available_copies: int
    status: str

    class Config:
        from_attributes = True


class BookCopyResponse(BaseModel):
    id: str
    status: str

    class Config:
        from_attributes = True


class BookDetailResponse(BaseModel):
    id: str
    title: str
    author: str
    isbn: str
    published_date: Optional[str] = None
    total_copies: int
    available_copies: int
    status: str
    copies: List[BookCopyResponse]

    class Config:
        from_attributes = True


class LoanResponse(BaseModel):
    id: str
    book_copy_id: str
    user_id: str
    borrowed_at: str
    due_date: str
    returned_at: Optional[str] = None
    fine_amount: float

    class Config:
        from_attributes = True


class UserLoanResponse(BaseModel):
    id: str
    book_copy_id: str
    borrowed_at: str
    due_date: str
    returned_at: Optional[str] = None
    fine_amount: float
    status: str  # active, returned, overdue
    title: str
    author: str

    class Config:
        from_attributes = True


class LibrarianLoanResponse(BaseModel):
    id: str
    book_copy_id: str
    borrowed_at: str
    due_date: str
    returned_at: Optional[str] = None
    fine_amount: float
    status: str
    title: str
    author: str
    user_id: str
    username: str

    class Config:
        from_attributes = True
