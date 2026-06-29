from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime, date


# Existing schemas for password reset microservice
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


# New schemas for Gym Membership Value Analyzer
class UserRegisterRequest(BaseModel):
    email: EmailStr
    password: str


class UserRegisterResponse(BaseModel):
    id: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True


class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserLoginResponse(BaseModel):
    access_token: str
    token_type: str


class MembershipCreateRequest(BaseModel):
    gym_name: str
    membership_type: str
    monthly_fee: float = Field(..., ge=0.0)


class MembershipResponse(BaseModel):
    id: str
    user_id: str
    gym_name: str
    membership_type: str
    monthly_fee: float
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class VisitCreateRequest(BaseModel):
    membership_id: str
    visit_date: date


class VisitResponse(BaseModel):
    id: str
    membership_id: str
    visit_date: date
    created_at: datetime

    class Config:
        from_attributes = True


class Alternative(BaseModel):
    name: str
    description: str
    estimated_monthly_cost: float
    estimated_savings: float


class MembershipAnalysis(BaseModel):
    membership_id: str
    gym_name: str
    monthly_fee: float
    total_visits: int
    cost_per_visit: float
    utilization_percentage: float
    status: str
    estimated_monthly_waste: float
    alternatives: List[Alternative]
    attendance_frequency: List[int]  # Visits per week (W1, W2, W3, W4)


class OverallSummary(BaseModel):
    total_monthly_fees: float
    total_visits_this_month: int
    average_cost_per_visit: float
    total_estimated_waste: float
    alerts: List[str]  # Active alerts/notifications


class AnalysisResponse(BaseModel):
    overall_summary: OverallSummary
    memberships_analysis: List[MembershipAnalysis]


class NotificationSettingsConfigureRequest(BaseModel):
    inactive_days_threshold: Optional[int] = Field(None, ge=1)
    cost_per_visit_threshold: Optional[float] = Field(None, ge=0.0)
    email_notifications_enabled: Optional[bool] = None


class NotificationSettingsResponse(BaseModel):
    id: str
    user_id: str
    inactive_days_threshold: int
    cost_per_visit_threshold: Optional[float]
    email_notifications_enabled: bool
    updated_at: datetime

    class Config:
        from_attributes = True
