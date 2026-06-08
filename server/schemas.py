from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from uuid import UUID
from datetime import datetime

# --- Password Reset Schemas ---

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

# --- DG Cluster Assortment Advisor Schemas ---

class KPIResponse(BaseModel):
    sales_per_linear_ft: float
    private_brand_pct: float
    in_stock_rate: float
    shelf_capacity_utilized: float

    class Config:
        from_attributes = True

class SKUResponse(BaseModel):
    id: UUID
    sku_number: str
    name: str
    brand: str
    current_sales: float
    sales_per_linear_ft: float
    in_stock_rate: float
    status: str

    class Config:
        from_attributes = True

class ScenarioResponse(BaseModel):
    id: UUID
    name: str
    description: str
    projected_sales_growth: float
    projected_private_brand_pct: float
    projected_shelf_capacity: float

    class Config:
        from_attributes = True

class ScenarioSelectRequest(BaseModel):
    scenario_name: str

class Guardrails(BaseModel):
    private_brand_check: bool
    shelf_capacity_check: bool

class ProposedChanges(BaseModel):
    add: int
    keep: int
    remove: int
    swap: int

class ScenarioSelectResponse(BaseModel):
    guardrails: Guardrails
    projected_kpis: KPIResponse
    proposed_changes: ProposedChanges
    skus: List[SKUResponse]

class ApprovalSubmitRequest(BaseModel):
    approved_by: str
    scenario_name: str

class ApprovalSummary(BaseModel):
    added_skus: int
    removed_skus: int
    scenario: str
    swapped_skus: int
    total_skus: int

class ApprovalSubmitResponse(BaseModel):
    approved_by: str
    success: bool
    summary: ApprovalSummary
    timestamp: datetime
    transaction_id: str
