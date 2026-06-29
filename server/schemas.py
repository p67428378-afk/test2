from pydantic import BaseModel
from typing import List
from uuid import UUID
from datetime import datetime


# Existing Password Reset Schemas
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
    private_brand_percentage: float
    sales_per_linear_ft: float
    shelf_capacity: float

    class Config:
        from_attributes = True


class SKUResponse(BaseModel):
    id: UUID
    product_name: str
    sku_code: str
    sales_revenue: float
    units_sold: int
    profit_margin: float
    days_of_supply: int
    status_badge: str

    class Config:
        from_attributes = True


class GuardrailChecks(BaseModel):
    all_passed: bool
    private_brand_passed: bool
    shelf_capacity_passed: bool
    sku_count_change_passed: bool


class ProjectedMetrics(BaseModel):
    in_stock_rate: float
    private_brand_percentage: float
    sales_per_linear_ft: float
    shelf_capacity: float


class SKUActionSummary(BaseModel):
    grow: int
    maintain: int
    reduce: int
    swap: int


class SKUActionItem(BaseModel):
    sku_id: UUID
    product_name: str
    sku_code: str
    action: str


class ScenarioResponse(BaseModel):
    scenario_name: str
    projected_metrics: ProjectedMetrics
    guardrail_checks: GuardrailChecks
    sku_action_summary: SKUActionSummary
    sku_actions: List[SKUActionItem]


class ApprovalRequest(BaseModel):
    scenario_name: str
    submitted_by: str


class ApprovalResponse(BaseModel):
    success: bool
    audit_trail_id: UUID
    scenario_name: str
    submitted_by: str
    submission_timestamp: datetime
    actions_count: int
