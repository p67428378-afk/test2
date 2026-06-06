from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from uuid import UUID

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


# New Assortment Advisor Schemas
class KPIDataResponse(BaseModel):
    in_stock_rate: float
    in_stock_target: float
    private_brand_percentage: float
    private_brand_target: float
    sales_per_linear_ft: float
    sales_per_linear_ft_change: float
    shelf_capacity_percentage: float
    shelf_capacity_total: float
    shelf_capacity_used: float

    class Config:
        from_attributes = True

class SKUPerformanceResponse(BaseModel):
    sku_id: str
    product_name: str
    brand: str
    weekly_sales: float
    linear_ft: float
    sales_per_linear_ft: float
    status: str

    class Config:
        from_attributes = True

class ScenarioCreateRequest(BaseModel):
    name: str
    description: Optional[str] = None
    strategy_type: str = Field(..., description="Conservative|Balanced|Aggressive")

class ScenarioResponse(BaseModel):
    id: UUID
    name: str
    description: Optional[str] = None
    strategy_type: str
    projected_sales_lift: float
    private_brand_percentage: float
    in_stock_rate: float
    shelf_space_utilized: float
    is_submitted: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class GuardrailsResponse(BaseModel):
    in_stock_ok: bool
    private_brand_ok: bool
    shelf_capacity_ok: bool

class SKUActionResponse(BaseModel):
    sku_id: str
    product_name: str
    brand: str
    action: str
    sales_impact: float

    class Config:
        from_attributes = True

class ScenarioDetailResponse(ScenarioResponse):
    guardrails: GuardrailsResponse
    sku_actions: List[SKUActionResponse]

    class Config:
        from_attributes = True

class StrategyProjectionResponse(BaseModel):
    name: str
    description: str
    type: str
    projected_sales_lift: float
    private_brand_percentage: float
    in_stock_rate: float
    shelf_space_utilized: float

class ScenarioSubmitResponse(BaseModel):
    success: bool
    audit_id: UUID
    submitted_at: datetime
    submitted_by: str

class AuditLogResponse(BaseModel):
    id: UUID
    scenario_id: UUID
    scenario_name: str
    submitted_at: datetime
    submitted_by: str
    action: str
    status: str

    class Config:
        from_attributes = True
