from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime


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


# --- Product Strategy Decision-Support Tool Schemas ---


class KPIResponse(BaseModel):
    business_per_branch: float
    capacity_utilization: float
    casa_ratio: float
    product_availability: float

    class Config:
        from_attributes = True


class ProductResponse(BaseModel):
    id: UUID
    name: str
    category: str
    aum_contribution: float
    npa_percentage: float
    status: str

    class Config:
        from_attributes = True


class ProductAction(BaseModel):
    action: str
    product_name: str


class Guardrails(BaseModel):
    kyc_aml_flags: str
    minimum_casa_floor: str
    pmla_2002_screening: str
    rbi_exposure_norms: str


class ScenarioResponse(BaseModel):
    id: UUID
    name: str
    casa_growth_projection: float
    npa_risk_projection: str
    roa_impact_projection: float
    product_actions: List[ProductAction]
    guardrails: Guardrails

    class Config:
        from_attributes = True


class ApprovalRequestCreate(BaseModel):
    scenario_id: UUID
    user_id: str
    user_name: str


class AuditTrailResponse(BaseModel):
    id: UUID
    approved_by: str
    guardrails_passed: List[str]
    timestamp: datetime

    class Config:
        from_attributes = True


class ApprovalRequestResponse(BaseModel):
    id: UUID
    scenario_id: UUID
    user_id: str
    submission_timestamp: datetime
    status: str
    audit_trail: Optional[AuditTrailResponse] = None

    class Config:
        from_attributes = True
