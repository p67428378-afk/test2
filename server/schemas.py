from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import List, Optional


# --- PASSWORD RESET SCHEMAS (EXISTING) ---
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


# --- LOAN PRODUCT SCHEMAS ---
class LoanProductBase(BaseModel):
    name: str
    interest_rate: float
    min_tenure_months: int
    max_tenure_months: int
    max_loan_amount: float


class LoanProductCreate(LoanProductBase):
    pass


class LoanProductResponse(LoanProductBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# --- EMI CALCULATOR SCHEMAS ---
class EMICalculateRequest(BaseModel):
    loan_amount: float
    interest_rate: float
    tenure_months: int


class EMICalculateResponse(BaseModel):
    emi: float
    total_interest: float
    total_repayment: float


# --- LOAN APPLICATION SCHEMAS ---
class LoanApplicationCreate(BaseModel):
    product_id: UUID
    customer_id: UUID
    requested_amount: float
    tenure_months: int
    monthly_income: float
    employment_type: str


class LoanApplicationCreateResponse(BaseModel):
    application_id: UUID
    status: str
    submitted_at: datetime


class CustomerApplicationResponse(BaseModel):
    application_id: UUID
    product_name: str
    requested_amount: float
    status: str
    submitted_at: datetime
    offered_amount: Optional[float] = None
    offer_status: Optional[str] = None

    class Config:
        from_attributes = True


class DecisionRequest(BaseModel):
    decision: str
    remarks: str


# --- NEW SCHEMAS FOR LOAN OFFER & AMORTIZATION SCHEDULE ---
class LoanOfferCreateRequest(BaseModel):
    offered_amount: float


class LoanOfferCreateResponse(BaseModel):
    application_id: UUID
    offer_status: str
    offered_amount: float


class LoanScheduleRow(BaseModel):
    month: int
    emi: float
    principal: float
    interest: float
    balance: float

    class Config:
        from_attributes = True


class LoanScheduleResponse(BaseModel):
    application_id: UUID
    schedule: List[LoanScheduleRow]


class OfferDecisionRequest(BaseModel):
    decision: str
    decline_reason: Optional[str] = None
