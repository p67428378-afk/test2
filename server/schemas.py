
from pydantic import BaseModel, UUID4
from typing import List, Optional
from decimal import Decimal
import datetime

class AccountBase(BaseModel):
    account_number: str
    account_type: str
    balance: Decimal
    currency: str

class AccountCreate(AccountBase):
    user_id: UUID4

class Account(AccountBase):
    account_id: UUID4
    user_id: UUID4

    class Config:
        orm_mode = True

class TransactionBase(BaseModel):
    type: str
    amount: Decimal
    description: Optional[str] = None
    status: str

class TransactionCreate(TransactionBase):
    account_id: UUID4

class Transaction(TransactionBase):
    transaction_id: UUID4
    account_id: UUID4
    timestamp: datetime.datetime

    class Config:
        orm_mode = True

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    user_id: UUID4
    accounts: List[Account] = []

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class TransferRequest(BaseModel):
    source_account_id: UUID4
    destination_account_id: UUID4
    amount: Decimal

class TransferResponse(BaseModel):
    status: str
    transaction_id: UUID4
