from pydantic import BaseModel
from typing import List
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


# Dashboard schemas
class KPIResponse(BaseModel):
    business_per_branch: float
    capacity_utilization: float
    casa_ratio: float
    scheme_availability: float

    class Config:
        from_attributes = True


class ProductResponse(BaseModel):
    product_id: UUID
    name: str
    category: str
    aum_contribution: float
    npa_percentage: float
    status: str

    class Config:
        from_attributes = True


# Scenario schemas
class Projections(BaseModel):
    casa_growth: float
    npa_risk_movement: float
    roa_impact: float


class GuardrailChecks(BaseModel):
    kyc_aml_flags: str
    minimum_casa_floor: str
    pmla_2002_screening: str
    rbi_exposure_norms: str


class RecommendedAction(BaseModel):
    product_id: UUID
    product_name: str
    action: str


class ScenarioResponse(BaseModel):
    scenario_name: str
    projections: Projections
    guardrail_checks: GuardrailChecks
    recommended_actions: List[RecommendedAction]


# Approval schemas
class ProductActionItem(BaseModel):
    product_id: UUID
    recommended_action: str


class ApprovalSubmitRequest(BaseModel):
    selected_scenario: str
    product_actions: List[ProductActionItem]


class GuardrailsPassed(BaseModel):
    kyc_aml_flags: bool
    minimum_casa_floor: bool
    pmla_2002_screening: bool
    rbi_exposure_norms: bool


class AuditTrail(BaseModel):
    approved_by: str
    guardrails_passed: GuardrailsPassed
    log_id: UUID
    scenario_name: str
    submission_timestamp: datetime


class ApprovalSubmitResponse(BaseModel):
    status: str
    audit_trail: AuditTrail
