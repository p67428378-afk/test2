from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime

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
class KPICardsResponse(BaseModel):
    in_stock_rate_pct: float
    private_brand_pct: float
    sales_per_linear_ft: float
    shelf_capacity_pct: float

class SKUPerformanceItem(BaseModel):
    sku_id: UUID
    name: str
    brand: Optional[str] = None
    sales: float
    units: int
    profit: float
    gm_pct: float
    status_badge: str

    class Config:
        from_attributes = True

class SKUPerformanceResponse(BaseModel):
    items: List[SKUPerformanceItem]
    limit: int
    page: int
    total: int

class ScenarioItem(BaseModel):
    scenario_id: UUID
    name: str
    projected_sales: float
    change_in_private_brand_pct: float
    shelf_utilization_pct: float
    is_selected: bool

    class Config:
        from_attributes = True

class ScenariosDefaultResponse(BaseModel):
    scenarios: List[ScenarioItem]

class AdjustmentItem(BaseModel):
    sku_id: UUID
    action: str  # ADD, KEEP, SWAP, REMOVE

class RecalculateRequest(BaseModel):
    scenario_id: UUID
    name: str
    adjustments: List[AdjustmentItem]

class RecalculateResponse(BaseModel):
    scenario_id: UUID
    name: str
    projected_sales: float
    change_in_private_brand_pct: float
    shelf_utilization_pct: float

class SubmitApprovalRequest(BaseModel):
    scenario_id: UUID
    applied_changes: List[AdjustmentItem]

class SubmitApprovalResponse(BaseModel):
    audit_id: UUID
    message: str
    status: str
    timestamp: datetime

class ConfirmationSummary(BaseModel):
    projected_sales_impact: float
    scenario_name: str
    total_skus_added: int
    total_skus_removed: int
    total_skus_swapped: int

class ConfirmationResponse(BaseModel):
    audit_id: UUID
    submitted_by: str
    summary: ConfirmationSummary
    timestamp: datetime
