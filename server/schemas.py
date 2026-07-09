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


# Assortment Advisor Schemas
class KPIResponse(BaseModel):
    in_stock_rate: float
    private_brand_pct: float
    sales_per_linear_ft: float
    shelf_capacity: float


class SKUPerformanceItem(BaseModel):
    sku: str
    product_name: str
    sales: float
    profit_margin: float
    days_of_supply: int
    status_badge: str
    trend_direction: str  # Up, Down, Flat


class SKUPerformanceResponse(BaseModel):
    items: List[SKUPerformanceItem]
    total: int
    page: int
    limit: int


class ScenarioProjectionsRequest(BaseModel):
    scenario_type: str


class Guardrails(BaseModel):
    private_brand_mix_ok: bool
    shelf_capacity_ok: bool


class SkuActions(BaseModel):
    add: int
    keep: int
    remove: int


class ScenarioProjectionsResponse(BaseModel):
    scenario_type: str
    projected_sales_lift: float
    projected_private_brand_pct: float
    holiday_lift_pct: Optional[float] = None  # Only for Aggressive scenario
    guardrails: Guardrails
    sku_actions: SkuActions


class AssortmentDecisionRequest(BaseModel):
    scenario_type: str


class AssortmentDecisionResponse(BaseModel):
    success: bool
    audit_id: str
    submitted_at: str
    summary: str
