from datetime import date, datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, EmailStr


# User / Auth
class UserLogin(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    password: str


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str = "procurement_admin"


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    email: str
    full_name: str
    role: str
    is_active: bool


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# Vendor
class VendorCreate(BaseModel):
    name: str
    contact_email: EmailStr


class VendorOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    contact_email: str
    status: str


# Contract
class ContractCreate(BaseModel):
    title: str
    vendor_id: Optional[str] = None
    vendor_name: Optional[str] = None
    effective_date: date
    termination_date: date
    total_value: float = 0.0
    terms: Optional[str] = None
    document_url: Optional[str] = None


class ContractUpdate(BaseModel):
    title: Optional[str] = None
    effective_date: Optional[date] = None
    termination_date: Optional[date] = None
    total_value: Optional[float] = None
    terms: Optional[str] = None
    document_url: Optional[str] = None
    current_version_num: Optional[int] = None  # for Optimistic Concurrency Control
    change_summary: Optional[str] = None


class ContractOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    contract_number: str
    vendor_id: str
    title: str
    status: str
    current_version: str
    version_number: int
    effective_date: date
    termination_date: date
    total_value: float
    terms: Optional[str] = None
    document_url: Optional[str] = None
    created_by: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    vendor: Optional[VendorOut] = None


class ContractListOut(BaseModel):
    items: List[ContractOut]
    total: int
    skip: int
    limit: int


# Versions
class ContractVersionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    contract_id: str
    version_string: str
    version_number: int
    terms_content: Optional[str] = None
    document_url: Optional[str] = None
    change_summary: Optional[str] = None
    created_by: Optional[str] = None
    created_at: datetime


# Comments
class CommentCreate(BaseModel):
    parent_id: Optional[str] = None
    clause_reference: Optional[str] = None
    comment_text: Optional[str] = None
    content: Optional[str] = None
    is_internal_only: bool = False


class CommentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    contract_id: str
    parent_id: Optional[str] = None
    user_id: str
    clause_reference: Optional[str] = None
    content: str
    is_internal_only: bool
    is_locked: bool
    created_at: datetime
    user_email: Optional[str] = None
    user_name: Optional[str] = None


# Approvals / Workflow
class ApprovalAction(BaseModel):
    action: str  # SUBMIT, APPROVE, REJECT, EXECUTE
    target_stage: Optional[str] = None
    comments: Optional[str] = None


class WorkflowHistoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    contract_id: str
    action: str
    from_stage: Optional[str] = None
    to_stage: Optional[str] = None
    actor_id: Optional[str] = None
    remarks: Optional[str] = None
    created_at: datetime


# Reminders
class RenewalReminderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    contract_id: str
    reminder_stage_days: int
    recipient_email: str
    status: str
    sent_at: datetime
    contract_title: Optional[str] = None
    days_remaining: Optional[int] = None
