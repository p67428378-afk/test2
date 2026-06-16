from pydantic import BaseModel, Field
from typing import Optional, List

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


# New DG Cluster Assortment Advisor Schemas

class KPIResponse(BaseModel):
    sales_per_linear_ft: float
    private_brand_percentage: float
    in_stock_rate: float
    shelf_capacity: float

class ProjectedImpact(BaseModel):
    sales_per_linear_ft: float
    private_brand_percentage: float

class SKUAction(BaseModel):
    sku_name: str
    action: str
    current_sales: float
    in_stock_rate: float
    private_brand: bool
    sales_per_linear_ft: float
    shelf_capacity: int

class GuardrailStatus(BaseModel):
    private_brand_ok: bool

class ScenarioResponse(BaseModel):
    scenario: str
    projected_impact: ProjectedImpact
    sku_actions: List[SKUAction]
    guardrail_status: GuardrailStatus

class DecisionActionInput(BaseModel):
    sku_name: str
    action: str

class DecisionSubmitRequest(BaseModel):
    scenario: str
    actions: List[DecisionActionInput]

class DecisionSubmitResponse(BaseModel):
    message: str
    audit_trail_id: str
