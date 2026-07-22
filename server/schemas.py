from pydantic import BaseModel, Field
from typing import List
from uuid import UUID
from datetime import datetime


# Existing schemas
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


# New schemas for Assortment Advisor
class KPIResponse(BaseModel):
    sales_per_linear_ft: float
    private_brand_percentage: float
    in_stock_rate: float
    shelf_capacity_utilized: float


class SKUResponse(BaseModel):
    id: UUID
    sku_name: str
    upc: str
    sales_rank_percentile: float
    weekly_sales: float
    margin_percentage: float
    is_private_brand: bool
    status: str


class ScenarioRequest(BaseModel):
    scenario_name: str


class GuardrailCheck(BaseModel):
    name: str
    pass_: bool = Field(..., alias="pass")

    class Config:
        populate_by_name = True
        # For older pydantic versions:
        allow_population_by_field_name = True


class SKUActionItem(BaseModel):
    sku_id: str
    sku_name: str


class ScenarioActions(BaseModel):
    add: List[SKUActionItem] = []
    reduce: List[SKUActionItem] = []
    swap: List[SKUActionItem] = []


class ScenarioResponse(BaseModel):
    scenario_name: str
    projected_private_brand_percentage: float
    projected_total_sales: float
    guardrails: List[GuardrailCheck]
    actions: ScenarioActions


class SubmitRequest(BaseModel):
    scenario_name: str
    projected_private_brand_percentage: float
    projected_total_sales: float
    guardrails: List[GuardrailCheck]
    actions: ScenarioActions


class SubmitResponse(BaseModel):
    audit_trail_id: UUID
    status: str
    submitted_at: datetime
