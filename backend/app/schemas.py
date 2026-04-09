from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field

class LoanBase(BaseModel):
    borrower_id: str
    loan_amount: float
    interest_rate: float
    term: str
    end_date: datetime

class LoanCreate(LoanBase):
    pass

class LoanUpdate(BaseModel):
    current_status: Optional[str] = None

class Loan(LoanBase):
    id: str
    start_date: datetime
    current_status: str

    class Config:
        from_attributes = True

class RepaymentScheduleBase(BaseModel):
    loan_id: str
    due_date: datetime
    scheduled_amount: float

class RepaymentScheduleCreate(RepaymentScheduleBase):
    pass

class RepaymentSchedule(RepaymentScheduleBase):
    id: str
    status: str

    class Config:
        from_attributes = True

class TransactionBase(BaseModel):
    loan_id: str
    amount_paid: float
    payment_method: str

class TransactionCreate(TransactionBase):
    payment_date: datetime = Field(default_factory=datetime.now)

class Transaction(TransactionBase):
    id: str
    payment_date: datetime

    class Config:
        from_attributes = True

class PenaltyBase(BaseModel):
    loan_id: str
    transaction_id: Optional[str] = None
    penalty_type: str
    amount: float
    reason: str

class PenaltyCreate(PenaltyBase):
    pass

class Penalty(PenaltyBase):
    id: str
    date_applied: datetime

    class Config:
        from_attributes = True

class AuditLogBase(BaseModel):
    loan_id: str
    event_type: str
    entity_id: Optional[str] = None
    old_state: Optional[str] = None
    new_state: Optional[str] = None
    actor: Optional[str] = None
    context: Optional[str] = None
    hash_signature: str

class AuditLogCreate(AuditLogBase):
    pass

class AuditLog(AuditLogBase):
    id: str
    timestamp: datetime

    class Config:
        from_attributes = True
