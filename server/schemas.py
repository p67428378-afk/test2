from pydantic import BaseModel
from typing import Optional, List, Dict, Any

# Password Reset Schemas
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
class KPIMetric(BaseModel):
    value: float
    change: float
    unit: str

class DashboardKPIs(BaseModel):
    sales_per_linear_ft: KPIMetric
    private_brand_pct: KPIMetric
    in_stock_rate: KPIMetric
    shelf_capacity: KPIMetric

class SKUPerformanceSchema(BaseModel):
    sku_id: str
    name: str
    sales: float
    profit_margin: float
    units_sold: int
    status_badge: str

    class Config:
        from_attributes = True

class DashboardDataResponse(BaseModel):
    kpis: DashboardKPIs
    skus: List[SKUPerformanceSchema]

class ScenarioActionSchema(BaseModel):
    sku_id: str
    name: str
    action_type: str

class GuardrailCheck(BaseModel):
    name: str
    status: str
    message: str

class ScenarioResponse(BaseModel):
    scenario_name: str
    projected_metrics: DashboardKPIs
    actions: List[ScenarioActionSchema]
    guardrails: List[GuardrailCheck]

class SubmitAction(BaseModel):
    sku_id: str
    action_type: str

class SubmitAssortmentRequest(BaseModel):
    scenario_name: str
    actions: List[SubmitAction]

class AuditTrailSchema(BaseModel):
    submission_id: str
    user_id: str
    timestamp: str
    scenario_name: str
    summary: str

class SubmitAssortmentResponse(BaseModel):
    status: str
    audit_trail: AuditTrailSchema
