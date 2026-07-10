from pydantic import BaseModel
from typing import List, Optional
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


# Claims schemas
class DamageBreakdownItem(BaseModel):
    part: str
    cost: float


class EstimateResponse(BaseModel):
    total_cost: float
    currency: str
    breakdown: List[DamageBreakdownItem]


class ClaimUploadResponse(BaseModel):
    claim_id: UUID


class ClaimEstimateResponse(BaseModel):
    status: str
    estimate: Optional[EstimateResponse] = None
    reason: Optional[str] = None
