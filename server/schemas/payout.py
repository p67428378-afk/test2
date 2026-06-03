
from pydantic import BaseModel, Field
from typing import List, Optional
from uuid import UUID
from datetime import datetime

class PayoutTransaction(BaseModel):
    transaction_id: UUID = Field(..., alias='id')
    fd_rd_account_number: str
    linked_savings_account_number: str
    gross_interest: float
    tds_amount: float
    net_payout_amount: float
    status: str
    failure_reason: Optional[str] = None
    form_16a_generated: bool
    form_16a_url: Optional[str] = None

    class Config:
        orm_mode = True
        allow_population_by_field_name = True

class PayoutBatch(BaseModel):
    batch_id: UUID = Field(..., alias='id')
    status: str
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    total_accounts_processed: int
    total_gross_interest: float
    total_tds_deducted: float
    total_net_payout: float
    report_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
        allow_population_by_field_name = True

class PayoutBatchCreate(BaseModel):
    process_due_by_date: str

class PayoutBatchInitiateResponse(BaseModel):
    batch_id: UUID
    message: str
    status: str

class PayoutBatchesResponse(BaseModel):
    batches: List[PayoutBatch]
    total: int

class PayoutTransactionsResponse(BaseModel):
    transactions: List[PayoutTransaction]
    total: int
