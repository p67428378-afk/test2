from pydantic import BaseModel
from typing import Optional, List
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
class KPIResponse(BaseModel):
    in_stock_rate: float
    private_brand_pct: float
    sales_per_linear_ft: float
    shelf_capacity: float

    class Config:
        from_attributes = True

class SKUItem(BaseModel):
    id: UUID
    sku_name: str
    sales_velocity: float
    margin_pct: float
    current_inventory: int
    status: str

    class Config:
        from_attributes = True

class SKUsResponse(BaseModel):
    items: List[SKUItem]
    limit: int
    page: int
    total: int

class ScenarioResponse(BaseModel):
    name: str
    sales_lift: float
    pb_change: float
    description: Optional[str] = None
    is_selected: bool

    class Config:
        from_attributes = True

class SKUAction(BaseModel):
    sku_id: UUID
    action: str

class SubmitRequest(BaseModel):
    scenario_name: str
    sku_actions: List[SKUAction]

class SubmitResponse(BaseModel):
    submitted_by: str
    success: bool
    timestamp: str
    tracking_id: str
