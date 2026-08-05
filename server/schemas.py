from typing import Optional, List, Dict
from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, EmailStr, Field


# Auth & User Schemas
class LoginRequest(BaseModel):
    email: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Optional["UserRead"] = None


class UserRead(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    department: Optional[str] = None
    role: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    department: Optional[str] = None
    role: Optional[str] = "RESEARCHER"


# Proposal Schemas
class ProposalCreate(BaseModel):
    title: str
    abstract: str
    requested_budget: Decimal
    co_investigators: Optional[str] = None
    timeline: Optional[str] = None
    department: Optional[str] = None
    status: Optional[str] = "DRAFT"


class ProposalUpdate(BaseModel):
    title: Optional[str] = None
    abstract: Optional[str] = None
    requested_budget: Optional[Decimal] = None
    co_investigators: Optional[str] = None
    timeline: Optional[str] = None
    department: Optional[str] = None
    status: Optional[str] = None
    document_url: Optional[str] = None


class ProposalRead(BaseModel):
    id: str
    title: str
    abstract: str
    pi_id: str
    department: str
    requested_budget: Decimal
    co_investigators: Optional[str] = None
    timeline: Optional[str] = None
    status: str
    document_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    pi: Optional[UserRead] = None

    class Config:
        from_attributes = True


# Evaluation Schemas
class EvaluationCreate(BaseModel):
    proposal_id: str
    reviewer_id: str


class EvaluationScoreRequest(BaseModel):
    methodology_score: Optional[int] = Field(None, ge=1, le=100)
    impact_score: Optional[int] = Field(None, ge=1, le=100)
    feasibility_score: Optional[int] = Field(None, ge=1, le=100)
    score: int = Field(..., ge=1, le=100)
    comments: Optional[str] = None


class EvaluationRead(BaseModel):
    id: str
    proposal_id: str
    reviewer_id: str
    methodology_score: Optional[int] = None
    impact_score: Optional[int] = None
    feasibility_score: Optional[int] = None
    score: Optional[int] = None
    comments: Optional[str] = None
    is_coi_flagged: bool
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ProposalEvaluationSummaryRead(BaseModel):
    proposal_id: str
    average_score: float
    evaluation_count: int
    evaluations: List[EvaluationRead]


# Award Schemas
class AwardApproveRequest(BaseModel):
    proposal_id: str
    allocated_budget: Decimal
    decision_notes: Optional[str] = None
    requires_revised_budget: Optional[bool] = False
    status: Optional[str] = "APPROVED"  # APPROVED or REJECTED


class AwardRead(BaseModel):
    id: str
    proposal_id: str
    allocated_budget: Decimal
    approved_by: str
    decision_notes: Optional[str] = None
    requires_revised_budget: bool
    status: str
    created_at: datetime
    updated_at: datetime
    notification_sent: bool = True

    class Config:
        from_attributes = True


# Milestone Schemas
class MilestoneCreate(BaseModel):
    award_id: str
    title: str
    due_date: datetime


class MilestoneSubmitRequest(BaseModel):
    progress_report: Optional[str] = None
    deliverable_url: Optional[str] = None


class MilestoneRead(BaseModel):
    id: str
    award_id: str
    title: str
    due_date: datetime
    status: str
    deliverable_url: Optional[str] = None
    progress_report: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    escalation_triggered: bool = False

    class Config:
        from_attributes = True


# Expense & Financial Report Schemas
class ExpenseLogCreate(BaseModel):
    award_id: str
    category: str  # PERSONNEL, EQUIPMENT, TRAVEL, INDIRECT
    amount: Decimal
    description: str
    category_cap: Optional[Decimal] = None


class ExpenseLogRead(BaseModel):
    id: str
    award_id: str
    category: str
    amount: Decimal
    description: str
    logged_by: str
    created_at: datetime

    class Config:
        from_attributes = True


class FinancialReportRead(BaseModel):
    award_id: str
    allocated_budget: Decimal
    total_expenses: Decimal
    remaining_budget: Decimal
    burn_rate_percentage: float
    category_breakdown: Dict[str, float]
    category_caps: Dict[str, float]
    cap_variance_warnings: List[str]
    expenses: List[ExpenseLogRead]


class AuditLogRead(BaseModel):
    id: str
    user_id: Optional[str] = None
    action: str
    resource: str
    timestamp: datetime

    class Config:
        from_attributes = True
