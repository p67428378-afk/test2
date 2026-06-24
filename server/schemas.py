"""
Module: server.schemas
Purpose: Pydantic schemas for Password Reset and Portfolio Optimizer services.
Author: Backend Developer Agent
Created: 2026-06-24
"""

from pydantic import BaseModel
from typing import List, Dict

# --- Password Reset Schemas ---


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


# --- Portfolio Optimizer Schemas ---


class KPIHeader(BaseModel):
    business_per_branch: str
    capacity_utilization: float
    casa_ratio: float
    scheme_availability_rate: float

    class Config:
        from_attributes = True


class ProductResponse(BaseModel):
    id: str
    name: str
    aum_contribution: float
    npa_percentage: float
    status: str

    class Config:
        from_attributes = True


class GuardrailsResponse(BaseModel):
    kyc_aml_flags: str
    minimum_casa_floor: str
    pmla_2002_screening: str
    rbi_exposure_norms: str

    class Config:
        from_attributes = True


class ScenarioResponse(BaseModel):
    id: str
    name: str
    casa_growth: str
    npa_risk_movement: str
    roa_impact: str
    product_actions: Dict[str, int]
    guardrails: GuardrailsResponse

    class Config:
        from_attributes = True


class DashboardDataResponse(BaseModel):
    kpis: KPIHeader
    products: List[ProductResponse]
    scenarios: List[ScenarioResponse]

    class Config:
        from_attributes = True


class DecisionRequest(BaseModel):
    approver_name: str
    scenario_id: str


class DecisionResponse(BaseModel):
    decision_id: str
    scenario_name: str
    approver_name: str
    timestamp: str
    guardrails_passed: int
    total_guardrails: int
    audit_trail_summary: str

    class Config:
        from_attributes = True
