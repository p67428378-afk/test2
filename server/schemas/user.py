
from pydantic import BaseModel, EmailStr
import uuid
import datetime

class UserBase(BaseModel):
    email: EmailStr
    phone_number: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    user_id: uuid.UUID
    created_at: datetime.datetime

    class Config:
        orm_mode = True
