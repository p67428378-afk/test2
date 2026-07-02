from pydantic import BaseModel, Field
from typing import List, Optional


# --- Existing Password Reset Schemas ---
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


# --- Fixed Deposit Feature Schemas ---


class FDProductResponse(BaseModel):
    id: str
    name: str
    tenure_months: int
    interest_rate: float
    min_deposit: float
    badge: Optional[str] = None

    class Config:
        from_attributes = True


class FDProductsListResponse(BaseModel):
    products: List[FDProductResponse]


class AccountResponse(BaseModel):
    id: str
    account_number: str
    balance: float
    currency: str

    class Config:
        from_attributes = True


class FDCreateRequest(BaseModel):
    product_id: str
    source_account_id: str
    deposit_amount: float = Field(..., gt=0)
    pin: str


class FDCreateResponse(BaseModel):
    fd_account_number: str
    interest_rate: float
    maturity_amount: float
    maturity_date: str
    principal_amount: float
    status: str
    tenure_months: int
