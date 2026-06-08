
from pydantic import BaseModel
from typing import Optional, List

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

# New schemas for Dashboard
class MacroIndicators(BaseModel):
    gdp_growth_pct: float
    inflation_rate_pct: float
    unemployment_rate_pct: float

class MonthlyTrend(BaseModel):
    month: str
    revenue: float
    expenditure: float

class RevenueStream(BaseModel):
    source: str
    amount: float
    status: str

class SectorExpenditure(BaseModel):
    sector: str
    amount: float

class DashboardSummaryResponse(BaseModel):
    macro_indicators: MacroIndicators
    monthly_trends: List[MonthlyTrend]
    net_surplus: float
    revenue_streams: List[RevenueStream]
    sector_expenditure: List[SectorExpenditure]
    total_expenditure: float
    total_revenue: float

class BudgetVarianceResponse(BaseModel):
    department_name: str
    allocated_budget: float
    actual_spending: float
    variance_amount: float
    variance_pct: float
    highlight: bool

class AllocateEmergencyFundRequest(BaseModel):
    amount: float
    department: str
    mfa_code: str
    project_name: str

class AllocateEmergencyFundResponse(BaseModel):
    amount: float
    authorized_by: str
    project_name: str
    success: bool
    timestamp: str
    transaction_id: str

class ReportResponse(BaseModel):
    pdf_binary_stream: str

class EmergencyFundTransactionResponse(BaseModel):
    id: str
    project_name: str
    amount: float
    authorized_by: str
    timestamp: str
