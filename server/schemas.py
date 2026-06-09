from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from uuid import UUID

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

class KPISchema(BaseModel):
    sales_per_linear_ft: float
    private_brand_pct: float
    in_stock_rate: float
    shelf_capacity: float

class SKUPerformanceSchema(BaseModel):
    sku_id: str
    sku_number: str
    name: str
    private_brand: bool
    sales_per_week: float
    in_stock_rate: float
    shelf_capacity_used: float
    status_badge: str

class SKUActionSchema(BaseModel):
    sku_id: str
    action: str

class GuardrailItemSchema(BaseModel):
    name: str
    status: str

class ScenarioDetailSchema(BaseModel):
    name: str
    projected_sales_lift: float
    projected_private_brand_pct: float
    actions_summary: str
    sku_actions: List[SKUActionSchema]
    guardrails: List[GuardrailItemSchema]

class AssortmentDashboardResponse(BaseModel):
    kpis: KPISchema
    sku_performance: List[SKUPerformanceSchema]
    scenarios: Dict[str, ScenarioDetailSchema]

class AssortmentReviewRequest(BaseModel):
    scenario: str
    actions: List[SKUActionSchema]

class AssortmentReviewResponse(BaseModel):
    status: str
    audit_id: str
    timestamp: str
