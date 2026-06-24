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


# --- DG Cluster Assortment Advisor Schemas ---


class KpiMetrics(BaseModel):
    in_stock_rate: float
    private_brand_percent: float
    sales_per_linear_ft: float
    shelf_capacity: int


class SkuAction(BaseModel):
    sku: str
    action: str


class Guardrails(BaseModel):
    private_brand_target_passed: bool
    sales_target_passed: bool
    shelf_capacity_passed: bool


class ScenarioImpact(BaseModel):
    name: str
    projected_impact: KpiMetrics
    guardrails: Guardrails
    sku_actions: List[SkuAction]


class SkuPerformance(BaseModel):
    id: UUID
    sku: str
    name: str
    private_brand_percent: float
    sales_per_linear_ft: float
    in_stock_rate: float
    shelf_capacity: int
    status: str

    class Config:
        from_attributes = True


class DashboardResponse(BaseModel):
    kpi_metrics: KpiMetrics
    scenarios: List[ScenarioImpact]
    sku_performance: List[SkuPerformance]


class AssortmentSubmitRequest(BaseModel):
    scenario_name: str
    sku_actions: List[SkuAction]


class AssortmentSubmitResponse(BaseModel):
    audit_trail_id: UUID
    scenario_name: str
    sku_actions_count: int
    status: str
    submitted_at: datetime
    submitted_by: str
