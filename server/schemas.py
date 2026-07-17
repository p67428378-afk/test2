from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


# --- Existing Password Reset Schemas ---
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


# --- KPI Schemas ---
class KPIDataResponse(BaseModel):
    sales_per_linear_ft: float
    private_brand_pct: float
    in_stock_rate: float
    shelf_capacity: float
    sales_trend_pct: float
    private_brand_target: float
    in_stock_target: float
    shelf_capacity_range_min: float
    shelf_capacity_range_max: float

    class Config:
        from_attributes = True


# --- SKU Schemas ---
class SKUItem(BaseModel):
    sku: str
    name: str
    sales_ytd: float
    units: int
    gm_pct: float
    recommendation: str
    is_private_brand: bool
    brand: Optional[str] = None

    class Config:
        from_attributes = True


class SKUListResponse(BaseModel):
    items: List[SKUItem]
    total: int
    skip: int
    limit: int


# --- Scenario Schemas ---
class Guardrails(BaseModel):
    gm_pct_impact: str
    private_brand_share: str
    shelf_space_limits: str


class ScenarioResponse(BaseModel):
    id: str
    name: str
    description: str
    private_brand_pct: float
    projected_sales_pct: float
    swaps_count: int
    guardrails: Guardrails


# --- Submit Plan Schemas ---
class SKUActionInput(BaseModel):
    sku: str
    action: str


class SubmitPlanRequest(BaseModel):
    selected_scenario: str
    sku_actions: List[SKUActionInput]


class SubmitPlanResponse(BaseModel):
    success: bool
    audit_id: str
    scenario: str
    manager_name: str
    submitted_at: datetime
