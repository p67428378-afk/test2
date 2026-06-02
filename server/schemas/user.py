
from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    phone_number: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    user_id: UUID
    created_at: datetime

    class Config:
        orm_mode = True
