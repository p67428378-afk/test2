from pydantic import BaseModel
from typing import List

# --- Existing Password Reset Schemas ---


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
    private_brand_percentage: float
    in_stock_rate: float
    shelf_capacity: float

    class Config:
        from_attributes = True


class SKUPerformanceSchema(BaseModel):
    sku_name: str
    upc: str
    weekly_sales: float
    profit_margin: float
    stock_level: int
    days_of_supply: int
    linear_shelf_footprint: float
    status: str

    class Config:
        from_attributes = True


class ActionCountsSchema(BaseModel):
    grow: int
    maintain: int
    reduce: int
    swap: int


class GuardrailsSchema(BaseModel):
    private_brand_passed: bool
    shelf_capacity_passed: bool
    new_items_passed: bool


class ScenarioResponse(BaseModel):
    scenario_name: str
    projected_sales_impact_pct: float
    projected_private_brand_pct: float
    projected_shelf_capacity_pct: float
    action_counts: ActionCountsSchema
    guardrails: GuardrailsSchema
    skus: List[SKUPerformanceSchema]

    class Config:
        from_attributes = True


class ChangeItem(BaseModel):
    upc: str
    action: str


class AssortmentScenarioRequest(BaseModel):
    scenario: str


class AssortmentSubmitRequest(BaseModel):
    scenario_applied: str
    changes: List[ChangeItem]


class SummaryOfChangesSchema(BaseModel):
    added: int
    removed: int
    swapped: int


class AssortmentSubmitResponse(BaseModel):
    confirmation_id: str
    timestamp: str
    user: str
    scenario_applied: str
    summary: SummaryOfChangesSchema

    class Config:
        from_attributes = True


# --- Legacy / Compatibility Schemas ---


class AssortmentDecisionRequest(BaseModel):
    scenario_applied: str
    user_name: str
    action_counts: ActionCountsSchema


class AssortmentDecisionResponse(BaseModel):
    confirmation_id: str
    scenario_applied: str
    user: str
    timestamp: str
    summary_of_changes: SummaryOfChangesSchema

    class Config:
        from_attributes = True
