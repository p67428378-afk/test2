from pydantic import BaseModel, Field
from typing import List, Optional
from uuid import UUID
from datetime import datetime


# --- Password Reset Schemas (Retained for compatibility) ---
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
class KPIResponse(BaseModel):
    sales_per_linear_ft: float
    private_brand_percentage: float
    in_stock_rate: float
    shelf_capacity_utilized: float
    sales_trend_percentage: float


class SKUResponse(BaseModel):
    sku_id: str
    product_name: str
    current_sales: float
    sales_growth: float
    is_private_brand: bool
    status: str

    class Config:
        from_attributes = True


class ScenarioRequest(BaseModel):
    scenario_name: str = Field(..., description="Conservative | Balanced | Aggressive")


class SKUAction(BaseModel):
    action: str = Field(..., description="ADD | REMOVE | SWAP | KEEP")
    product_name: Optional[str] = None
    sku_id: str


class GuardrailCheck(BaseModel):
    name: str
    passed: bool
    details: str


class ScenarioResponse(BaseModel):
    scenario_name: str
    projected_sales_impact: float
    projected_pb_impact: float
    sku_actions: List[SKUAction]
    guardrails: List[GuardrailCheck]


class DecisionRequest(BaseModel):
    scenario_name: str
    sku_actions: List[SKUAction]


class DecisionResponse(BaseModel):
    status: str
    audit_trail_id: UUID
    submitted_at: datetime
