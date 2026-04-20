
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TransactionBase(BaseModel):
    transaction_id: str
    amount: float
    sender: str
    receiver: str
    device_fingerprint: str

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    id: int
    timestamp: datetime
    status: str
    is_mule_account: bool
    npci_positive_pay_status: str

    class Config:
        from_attributes = True

class TransactionUpdate(BaseModel):
    status: Optional[str] = None
    is_mule_account: Optional[bool] = None
    npci_positive_pay_status: Optional[str] = None
