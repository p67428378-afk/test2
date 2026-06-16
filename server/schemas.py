import uuid
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional

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

class KPIResponse(BaseModel):
    sales_per_linear_ft: float
    private_brand_percentage: float
    in_stock_rate: float
    shelf_capacity: int

    class Config:
        from_attributes = True

class SKUResponse(BaseModel):
    id: uuid.UUID
    name: str
    weekly_sales: float
    profit_margin: float
    days_of_supply: int
    recommended_action: str

    class Config:
        from_attributes = True

class DecisionItemCreate(BaseModel):
    sku_id: uuid.UUID
    action: str

class DecisionCreateRequest(BaseModel):
    scenario_name: str
    submitted_by: str
    items: List[DecisionItemCreate]

class DecisionResponse(BaseModel):
    id: uuid.UUID
    scenario_name: str
    submitted_by: str
    submitted_at: datetime
    status: str
    audit_id: str

    class Config:
        from_attributes = True
