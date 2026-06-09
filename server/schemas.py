from pydantic import BaseModel
from typing import Optional, List
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

class DashboardKPIsResponse(BaseModel):
    sales_per_linear_ft: float
    private_brand_pct: float
    in_stock_rate: float
    shelf_capacity: float

    class Config:
        from_attributes = True

class SKUPerformanceItem(BaseModel):
    sku_id: UUID
    name: str
    sales: float
    profit: float
    volume: int
    status: str

    class Config:
        from_attributes = True

class SKUPerformanceResponse(BaseModel):
    items: List[SKUPerformanceItem]
    limit: int
    page: int
    total: int

class ScenarioResponse(BaseModel):
    id: UUID
    name: str
    description: str
    projected_sales: float
    projected_profit: float
    projected_private_brand_pct: float

    class Config:
        from_attributes = True

class ScenarioSelectRequest(BaseModel):
    scenario_id: UUID

class ScenarioActionItem(BaseModel):
    sku_id: UUID
    sku_name: str
    action: str

class ScenarioGuardrailItem(BaseModel):
    name: str
    passed: bool
    value: str

class ScenarioSelectResponse(BaseModel):
    scenario_id: UUID
    name: str
    projected_sales_change_pct: float
    projected_profit_change_pct: float
    projected_private_brand_pct: float
    actions: List[ScenarioActionItem]
    guardrails: List[ScenarioGuardrailItem]

class ApprovalSubmitRequest(BaseModel):
    scenario_id: UUID

class ApprovalSubmitResponse(BaseModel):
    success: bool
    audit_trail_id: UUID
    transaction_id: str
    timestamp: str
    user_email: str
