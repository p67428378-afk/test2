from pydantic import BaseModel
from typing import List
from datetime import datetime


# KPI Schemas
class KPICardSales(BaseModel):
    value: float
    trend_yoy: float


class KPICardPrivateBrand(BaseModel):
    value: float
    target: float


class KPICardInStock(BaseModel):
    value: float
    status: str


class KPICardShelfCapacity(BaseModel):
    value: float
    remaining_ft: float


class KPISchema(BaseModel):
    sales_per_linear_ft: KPICardSales
    private_brand_pct: KPICardPrivateBrand
    in_stock_rate: KPICardInStock
    shelf_capacity_pct: KPICardShelfCapacity


# SKU Schemas
class SKUResponse(BaseModel):
    sku_id: str
    name: str
    current_sales: float
    sales_trend_yoy: float
    profit_margin: float
    in_stock_rate: float
    recommendation: str

    class Config:
        from_attributes = True


# Scenario Schemas
class ScenarioCalculateRequest(BaseModel):
    scenario_type: str


class GuardrailCheck(BaseModel):
    message: str
    passed: bool


class Guardrails(BaseModel):
    capacity_check: GuardrailCheck
    private_brand_check: GuardrailCheck
    swap_limit_check: GuardrailCheck


class ScenarioCalculateResponse(BaseModel):
    scenario_type: str
    projected_sales_lift: float
    projected_private_brand_pct: float
    projected_shelf_capacity_pct: float
    sku_actions: List[str]
    guardrails: Guardrails


# Approval Schemas
class ApprovalRequest(BaseModel):
    scenario_type: str


class ApprovalResponse(BaseModel):
    success: bool
    audit_trail_id: str
    submitted_by: str
    sku_changes_summary: str
    timestamp: datetime


# Password Reset Schemas (Required for existing password reset endpoints)
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
