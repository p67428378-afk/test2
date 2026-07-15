from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional
from uuid import UUID


# User Schemas
class UserRegisterRequest(BaseModel):
    email: EmailStr
    master_password: str = Field(..., min_length=8)


class UserRegisterResponse(BaseModel):
    id: UUID
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True


class UserLoginRequest(BaseModel):
    email: EmailStr
    master_password: str


class UserLoginResponse(BaseModel):
    access_token: str
    token_type: str


# Password Entry Schemas
class PasswordEntryCreate(BaseModel):
    title: str
    url: Optional[str] = None
    username: str
    password: str


class PasswordEntryUpdate(BaseModel):
    title: Optional[str] = None
    url: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None


class PasswordEntryResponse(BaseModel):
    id: UUID
    title: str
    url: Optional[str] = None
    username: str
    password: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Password Generation Schemas
class PasswordGenerateRequest(BaseModel):
    length: int = Field(16, ge=4, le=128)
    include_uppercase: bool = True
    include_lowercase: bool = True
    include_numbers: bool = True
    include_symbols: bool = True


class PasswordGenerateResponse(BaseModel):
    password: str
