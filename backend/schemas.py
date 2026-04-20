from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class TransactionBase(BaseModel):
    amount: float
    type: str
    timestamp: datetime

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    id: str
    account_id: str

    class Config:
        from_attributes = True

class AccountBase(BaseModel):
    account_number: str
    opening_balance: float

class AccountCreate(AccountBase):
    pass

class Account(AccountBase):
    id: str
    transactions: List[Transaction] = []

    class Config:
        from_attributes = True

class StatementRequest(BaseModel):
    account_number: str
    start_date: datetime
    end_date: datetime

class Statement(BaseModel):
    account_number: str
    start_date: datetime
    end_date: datetime
    opening_balance: float
    closing_balance: float
    transactions: List[Transaction]
