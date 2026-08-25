from enum import Enum
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class FineStatusEnum(str, Enum):
    UNPAID = "UNPAID"
    PENDING_VERIFICATION = "PENDING_VERIFICATION"
    PAID = "PAID"
    OVERDUE = "OVERDUE"
    VOIDED = "VOIDED"


class LoginRequest(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str = "admin"


class FineCreate(BaseModel):
    license_plate: str = Field(..., min_length=1)
    violation_type: str = Field(..., min_length=1)
    location: str = Field(..., min_length=1)
    amount: float = Field(..., gt=0)
    issue_date: Optional[datetime] = None
    due_date: datetime


class FineUpdate(BaseModel):
    status: Optional[FineStatusEnum] = None
    amount: Optional[float] = Field(None, gt=0)
    transaction_reference: Optional[str] = None
    notes: Optional[str] = None


class FineResponse(BaseModel):
    id: str
    ticket_number: str
    license_plate: str
    violation_type: str
    location: str
    amount: float
    status: str
    issue_date: datetime
    due_date: datetime
    payment_timestamp: Optional[datetime] = None
    transaction_reference: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class FineStatusResponse(BaseModel):
    id: str
    ticket_number: str
    status: str
    amount: float
    overdue_penalty: float
    total_due: float
    due_date: datetime

    model_config = ConfigDict(from_attributes=True)


class AuditLogResponse(BaseModel):
    id: str
    fine_id: Optional[str] = None
    actor_id: str
    action: str
    notes: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
