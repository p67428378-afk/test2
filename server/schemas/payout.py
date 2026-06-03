from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime

class PayoutBatchBase(BaseModel):
    status: str
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    total_accounts_processed: int = 0
    total_gross_interest: float = 0
    total_tds_deducted: float = 0
    total_net_payout: float = 0
    report_url: Optional[str] = None

class PayoutBatchCreate(BaseModel):
    process_due_by_date: str

class PayoutBatchResponse(BaseModel):
    batch_id: UUID
    message: str
    status: str

class PayoutBatch(PayoutBatchBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class PayoutTransactionBase(BaseModel):
    fd_rd_account_number: str
    linked_savings_account_number: str
    gross_interest: float
    tds_amount: float
    net_payout_amount: float
    status: str
    failure_reason: Optional[str] = None
    form_16a_generated: bool = False
    form_16a_url: Optional[str] = None

class PayoutTransaction(PayoutTransactionBase):
    id: UUID
    batch_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class PayoutBatchDetails(PayoutBatch):
    pass

class PayoutBatchesResponse(BaseModel):
    batches: List[PayoutBatch]
    total: int

class PayoutTransactionsResponse(BaseModel):
    transactions: List[PayoutTransaction]
    total: int
