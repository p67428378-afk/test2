from pydantic import BaseModel
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


# Treasury Schemas


class AccountBase(BaseModel):
    name: str
    account_number: str
    currency: str
    balance: float
    bank_provider: str
    is_hub: bool = False


class AccountCreate(AccountBase):
    pass


class AccountResponse(AccountBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SweepRuleBase(BaseModel):
    source_account_id: UUID
    hub_account_id: UUID
    target_balance: float
    sweep_threshold: float
    schedule: str
    status: str = "ACTIVE"


class SweepRuleCreate(SweepRuleBase):
    pass


class SweepRuleUpdate(BaseModel):
    target_balance: Optional[float] = None
    sweep_threshold: Optional[float] = None
    schedule: Optional[str] = None
    status: Optional[str] = None


class SweepRuleResponse(SweepRuleBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class HedgeRuleBase(BaseModel):
    currency_pair: str
    amount_threshold: float
    volatility_threshold: Optional[float] = None
    status: str = "ACTIVE"


class HedgeRuleCreate(HedgeRuleBase):
    pass


class HedgeRuleUpdate(BaseModel):
    amount_threshold: Optional[float] = None
    volatility_threshold: Optional[float] = None
    status: Optional[str] = None


class HedgeRuleResponse(HedgeRuleBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ActivityLogResponse(BaseModel):
    id: UUID
    transaction_id: UUID
    sweep_rule_id: Optional[UUID] = None
    hedge_rule_id: Optional[UUID] = None
    type: str
    status: str
    amount: Optional[float] = None
    currency: Optional[str] = None
    fx_rate: Optional[float] = None
    converted_amount_usd: Optional[float] = None
    details: Optional[dict] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ActivityLogsPaginated(BaseModel):
    logs: List[ActivityLogResponse]
    total: int


class TriggerSweepRequest(BaseModel):
    region: Optional[str] = None


class TriggerSweepResponse(BaseModel):
    hedges_triggered: int
    status: str
    sweeps_executed: int
    transaction_id: UUID


class DashboardStatsResponse(BaseModel):
    active_hedges_count: int
    active_rules_count: int
    idle_cash_minimized_usd: float
    total_swept_usd: float


class CurrencyDistributionItem(BaseModel):
    amount: float
    currency: str


class TrendItem(BaseModel):
    amount: float
    date: str


class DashboardChartsResponse(BaseModel):
    currency_distribution: List[CurrencyDistributionItem]
    trend: List[TrendItem]


class DeleteResponse(BaseModel):
    message: str
    status: str
