from pydantic import BaseModel
from typing import Optional, List

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

class KPIMetric(BaseModel):
    value: float
    change_percentage: float
    trend: str

class KPIResponse(BaseModel):
    sales_per_linear_ft: KPIMetric
    private_brand_percentage: KPIMetric
    in_stock_rate: KPIMetric
    shelf_capacity: KPIMetric

class SKUResponse(BaseModel):
    sku: str
    name: str
    brand: str
    is_private_brand: bool
    sales: float
    profit_margin: float
    units_sold: int
    days_of_supply: int
    status: str

class Guardrails(BaseModel):
    private_brand_target_passed: bool
    shelf_capacity_passed: bool

class SKUAction(BaseModel):
    sku: str
    action: str

class ScenarioResponse(BaseModel):
    id: str
    name: str
    description: str
    projected_sales: float
    projected_pb_percentage: float
    projected_in_stock_rate: float
    projected_shelf_capacity: float
    guardrails: Guardrails
    sku_actions: List[SKUAction]

class SubmitScenarioRequest(BaseModel):
    scenario_id: str
    submitted_by: str
    acknowledge_violations: bool

class SubmitScenarioResponse(BaseModel):
    id: str
    scenario_id: str
    scenario_name: str
    submitted_by: str
    submitted_at: str
    audit_id: str
    status: str
    message: str
