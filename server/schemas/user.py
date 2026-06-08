from pydantic import BaseModel, EmailStr
import uuid
from typing import List, Optional

class UserPreferenceBase(BaseModel):
    dietary_goals: Optional[List[str]] = None
    cooking_time: Optional[int] = None
    preferences: Optional[List[str]] = None

class UserPreferenceCreate(UserPreferenceBase):
    pass

class UserPreferenceUpdate(UserPreferenceBase):
    pass

class UserPreference(UserPreferenceBase):
    id: uuid.UUID
    user_id: uuid.UUID

    class Config:
        orm_mode = True

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: uuid.UUID
    preferences: Optional[UserPreference] = None

    class Config:
        orm_mode = True
