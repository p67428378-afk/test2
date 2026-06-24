from pydantic import BaseModel
from typing import Optional, List


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


# --- New Schemas for Retail Banking Product Decision-Support Dashboard ---


class KPIHeader(BaseModel):
    availability_rate: float
    business_per_branch: str
    capacity_utilization: float
    casa_ratio: float


class ProductResponse(BaseModel):
    id: str
    name: str
    category: str
    aum_contribution: float
    npa_percentage: Optional[float] = None
    status: str

    class Config:
        from_attributes = True


class ProductActionResponse(BaseModel):
    product_id: str
    action: str

    class Config:
        from_attributes = True


class GuardrailsResponse(BaseModel):
    kyc_aml_flags: bool
    min_casa_floor: bool
    pmla_2002_screening: bool
    rbi_exposure_norms: bool


class ScenarioResponse(BaseModel):
    id: str
    name: str
    description: str
    casa_growth: float
    npa_risk: str
    roa_impact: float
    guardrails: GuardrailsResponse
    product_actions: List[ProductActionResponse]

    class Config:
        from_attributes = True


class DashboardResponse(BaseModel):
    kpis: KPIHeader
    products: List[ProductResponse]
    scenarios: List[ScenarioResponse]


class ProposedActionRequest(BaseModel):
    product_id: str
    action: str


class ProposalCreateRequest(BaseModel):
    scenario_id: str
    proposed_actions: List[ProposedActionRequest]


class ProposalResponse(BaseModel):
    id: str
    scenario_id: str
    status: str
    submitted_by: str
    routed_to: str
    timestamp: str
    guardrails_passed: bool
    audit_trail: str

    class Config:
        from_attributes = True
