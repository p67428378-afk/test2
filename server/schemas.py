from pydantic import BaseModel
from typing import List
from uuid import UUID
from datetime import datetime


# --- Original Password Reset Schemas ---
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


# --- New KPI Schemas ---
class KPISchema(BaseModel):
    sales_per_linear_ft: float
    private_brand_percentage: float
    in_stock_rate: float
    shelf_capacity: float

    class Config:
        from_attributes = True


# SKU Schemas
class SKUSchema(BaseModel):
    id: UUID
    name: str
    sales: float
    profit_margin: float
    units_sold: int
    status: str

    class Config:
        from_attributes = True


# Scenario Calculation Schemas
class ScenarioCalculateRequest(BaseModel):
    scenario_name: str


class GuardrailCheck(BaseModel):
    name: str
    status: str
    message: str


class SKUAction(BaseModel):
    sku_id: str
    sku_name: str
    action: str


class ScenarioCalculateResponse(BaseModel):
    scenario_name: str
    projected_sales_lift: float
    projected_margin_lift: float
    guardrails: List[GuardrailCheck]
    sku_actions: List[SKUAction]


# Assortment Review Schemas
class AssortmentReviewRequest(BaseModel):
    scenario_name: str


class AuditTrailSummary(BaseModel):
    submission_id: str
    timestamp: str


class AssortmentReviewResponse(BaseModel):
    id: UUID
    scenario_name: str
    submitted_by: str
    created_at: datetime
    status: str
    audit_trail_summary: AuditTrailSummary

    class Config:
        from_attributes = True
