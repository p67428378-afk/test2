from pydantic import BaseModel, ConfigDict
from typing import List
from datetime import datetime
from uuid import UUID


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


class KPISchema(BaseModel):
    sales_per_linear_ft: float
    private_brand_percentage: float
    in_stock_rate: float
    shelf_capacity: float


class SKUSchema(BaseModel):
    sku: str
    sales_per_linear_ft: float
    is_private_brand: bool
    in_stock_rate: float
    status: str


class GuardrailsSchema(BaseModel):
    private_brand_goal_met: bool
    shelf_capacity_within_limits: bool


class SKUActionSchema(BaseModel):
    sku: str
    action: str


class ScenarioSchema(BaseModel):
    scenario_name: str
    projected_sales_impact: float
    projected_private_brand: float
    guardrails: GuardrailsSchema
    sku_actions: List[SKUActionSchema]


class AssortmentPlanCreate(BaseModel):
    scenario_name: str
    submitted_by: str


class AssortmentPlanResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    scenario_name: str
    created_at: datetime
    submitted_by: str
    audit_trail_id: str
    guardrail_status: GuardrailsSchema
    sku_actions: List[SKUActionSchema]
