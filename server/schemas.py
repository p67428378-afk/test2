from pydantic import BaseModel
from typing import Optional, List, Dict, Any

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

class SKUResponseSchema(BaseModel):
    sku_id: str
    name: str
    category: str
    private_brand: bool
    sales_per_linear_ft: float
    in_stock_rate: float
    status: str

class SKUActionSchema(BaseModel):
    sku_id: str
    action: str

class GuardrailsSchema(BaseModel):
    shelf_space_limit: str
    private_brand_target: str
    sales_growth: str

class ScenarioDetailSchema(BaseModel):
    projected_sales_lift: float
    projected_private_brand_pct: float
    actions_summary: str
    sku_actions: List[SKUActionSchema]
    guardrails: GuardrailsSchema

class SnacksDashboardResponse(BaseModel):
    kpis: KPISchema
    skus: List[SKUResponseSchema]
    scenarios: Dict[str, ScenarioDetailSchema]

class AssortmentReviewRequest(BaseModel):
    scenario_name: str
    actions: List[SKUActionSchema]

class AssortmentReviewResponse(BaseModel):
    status: str
    message: str
    audit_id: str
    timestamp: str
