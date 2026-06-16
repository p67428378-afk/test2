
from pydantic import BaseModel, UUID4
from typing import Optional

class UserBase(BaseModel):
    username: str
    full_name: Optional[str] = None
    role: str
    station: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: UUID4

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
