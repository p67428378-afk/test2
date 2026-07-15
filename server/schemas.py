from pydantic import BaseModel
from typing import List
from uuid import UUID
from datetime import datetime


# Existing schemas for password reset (RESTORED)
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


# New schemas for DG Cluster Assortment Advisor
class KPIMetricsResponse(BaseModel):
    sales_per_linear_ft: float
    private_brand_percentage: float
    in_stock_rate: float
    shelf_capacity_percentage: float


class ScenarioActionDetail(BaseModel):
    action: str


class SKUScenarios(BaseModel):
    Conservative: ScenarioActionDetail
    Balanced: ScenarioActionDetail
    Aggressive: ScenarioActionDetail


class SKUPerformanceResponse(BaseModel):
    sku_id: UUID
    sku_number: str
    product_name: str
    is_private_brand: bool
    sales: float
    units: int
    margin_percentage: float
    scenarios: SKUScenarios


class SKUActionItem(BaseModel):
    sku_id: UUID
    action: str


class AssortmentSubmitRequest(BaseModel):
    scenario_selected: str
    sku_actions: List[SKUActionItem]


class AssortmentSubmitResponse(BaseModel):
    submission_id: UUID
    status: str
    scenario_selected: str
    actions_submitted_count: int
    manager_email: str
    timestamp: datetime
    audit_trail_summary: str
