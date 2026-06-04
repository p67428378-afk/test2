from pydantic import BaseModel

class BalanceRequest(BaseModel):
    account_number: str
    otp: str

class BalanceResponse(BaseModel):
    status: str
    available_balance: str
    ledger_balance: str
    currency: str

class ErrorResponse(BaseModel):
    status: str
    reason: str
