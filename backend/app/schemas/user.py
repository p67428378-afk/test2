from pydantic import BaseModel, ConfigDict
from typing import List
from .account import Account

class UserBase(BaseModel):
    email: str
    name: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str
    accounts: List[Account] = []

    model_config = ConfigDict(from_attributes=True)
