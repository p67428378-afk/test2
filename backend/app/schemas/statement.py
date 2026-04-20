from pydantic import BaseModel, Field
from datetime import date
from typing import Literal

class StatementRequest(BaseModel):
    account_number: str = Field(..., pattern=r"^\d{10}$", description="The 10-digit account number.")
    start_date: date
    end_date: date
    format: Literal['pdf', 'excel'] = 'pdf'

class Transaction(BaseModel):
    id: str
    date: date
    description: str
    amount: float
    type: str

    class Config:
        from_attributes = True

class Statement(BaseModel):
    account_number: str
    start_date: date
    end_date: date
    opening_balance: float
    closing_balance: float
    transactions: list[Transaction]
