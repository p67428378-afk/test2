from pydantic import BaseModel, Field
from typing import List


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


# New Recharge schemas
class LinkedAccount(BaseModel):
    account_number: str
    balance: float
    status: str


class RecentTransaction(BaseModel):
    id: str
    account_number: str
    amount: float
    operator: str
    status: str
    created_at: str


class MonthlyStats(BaseModel):
    total_amount: float


class DashboardResponse(BaseModel):
    linked_account: LinkedAccount
    monthly_stats: MonthlyStats
    recent_transactions: List[RecentTransaction]


class ValidateOperatorRequest(BaseModel):
    account_number: str
    operator_name: str


class ValidateOperatorResponse(BaseModel):
    biller_id: str
    is_valid: bool
    operator_name: str


class RechargeRequest(BaseModel):
    account_number: str
    amount: float = Field(..., gt=0)
    operator_name: str


class RechargeResponse(BaseModel):
    transactionId: str
    status: str
    bbpsReferenceId: str
    operatorReferenceId: str
    created_at: str
