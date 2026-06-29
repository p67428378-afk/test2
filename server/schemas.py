from pydantic import BaseModel
from typing import List


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


# Assortment Advisor Schemas


class KPIsResponse(BaseModel):
    sales_per_linear_ft: float
    private_brand_percentage: float
    in_stock_rate: float
    shelf_capacity_utilized: float


class SKUResponse(BaseModel):
    sku: str
    product_name: str
    brand: str
    sub_category: str
    sales_velocity: float
    sales_trend: float
    status: str


class GuardrailCheck(BaseModel):
    name: str
    status: str
    message: str


class ProjectedImpact(BaseModel):
    sales_per_linear_ft_change: float
    private_brand_percentage_change: float
    in_stock_rate_change: float
    shelf_capacity_utilized_change: float


class SkuActionSummary(BaseModel):
    add: int
    keep: int
    swap: int
    remove: int


class ScenarioResponse(BaseModel):
    scenario_name: str
    projected_impact: ProjectedImpact
    sku_action_summary: SkuActionSummary
    guardrail_checks: List[GuardrailCheck]


class ApprovalAction(BaseModel):
    sku: str
    action: str


class ApprovalRequest(BaseModel):
    scenario_name: str
    actions: List[ApprovalAction]


class ApprovalResponse(BaseModel):
    success: bool
    message: str
    audit_trail_id: str
