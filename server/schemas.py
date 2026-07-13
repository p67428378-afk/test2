from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional
from datetime import datetime


class UserRegister(BaseModel):
    email: EmailStr
    master_password: str = Field(..., min_length=8)


class UserLogin(BaseModel):
    email: str
    master_password: str


class UserResponse(BaseModel):
    id: str
    email: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str


class CredentialCreate(BaseModel):
    title: str
    username: str
    password: str
    url: Optional[str] = None


class CredentialUpdate(BaseModel):
    title: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None
    url: Optional[str] = None


class CredentialResponse(BaseModel):
    id: str
    title: str
    username: str
    password: str
    url: Optional[str] = None
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
