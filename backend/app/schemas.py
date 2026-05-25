
from pydantic import BaseModel
from typing import List, Optional

class AccountBase(BaseModel):
    account_type: str
    balance: float

class AccountCreate(AccountBase):
    pass

class Account(AccountBase):
    id: str
    owner_id: str

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    username: str
    email: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str
    accounts: List[Account] = []

    class Config:
        from_attributes = True
