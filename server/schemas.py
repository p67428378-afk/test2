from pydantic import BaseModel, EmailStr, Field
from uuid import UUID
from datetime import datetime
from decimal import Decimal
from typing import List, Optional

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: UUID
    mfa_enabled: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class Account(BaseModel):
    id: UUID
    user_id: UUID
    account_number: str
    account_type: str
    balance: Decimal
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class Transaction(BaseModel):
    id: UUID
    account_id: UUID
    type: str
    amount: Decimal
    description: Optional[str] = None
    transaction_date: datetime
    created_at: datetime

    class Config:
        orm_mode = True

class Transfer(BaseModel):
    id: UUID
    from_account_id: UUID
    to_account_id: UUID
    amount: Decimal
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class TransferCreate(BaseModel):
    from_account_id: UUID
    to_account_id: UUID
    amount: Decimal
