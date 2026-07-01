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


# --- Assortment Advisor Schemas ---


class KPIResponse(BaseModel):
    in_stock_rate: float
    private_brand_pct: float
    sales_per_linear_ft: float
    shelf_capacity: float


class SKUPerformanceItem(BaseModel):
    days_of_supply: int
    id: UUID
    profit_margin: float
    sku_name: str
    status: str
    stock_level: int
    upc: str
    weekly_sales: float

    class Config:
        from_attributes = True


class SKUPerformanceResponse(BaseModel):
    items: List[SKUPerformanceItem]
    limit: int
    page: int
    total: int


class ScenarioProjectionRequest(BaseModel):
    scenario_type: str


class ActionCounts(BaseModel):
    grow: int
    maintain: int
    reduce: int
    swap: int


class Guardrails(BaseModel):
    margin_target_passed: bool
    private_brand_passed: bool
    space_capacity_passed: bool


class ScenarioProjectionResponse(BaseModel):
    action_counts: ActionCounts
    guardrails: Guardrails
    projected_private_brand_pct: float
    projected_sales_lift: float
    projected_shelf_capacity: float
    scenario_type: str


class AssortmentDecisionRequest(BaseModel):
    action_counts: ActionCounts
    scenario_applied: str
    user_name: str


class AssortmentDecisionResponse(BaseModel):
    audit_id: UUID
    submitted_at: datetime
    success: bool
    summary: str
