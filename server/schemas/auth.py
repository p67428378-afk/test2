"""
Module: server.schemas.auth
Purpose: Authentication schemas.
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, ConfigDict


class RegisterRequest(BaseModel):
    email: EmailStr
    full_name: str
    password: str
    phone: Optional[str] = None
    role: str = Field(..., description="one of: customer, restaurant, delivery, admin")


class RegisterResponse(BaseModel):
    id: str
    email: str
    full_name: str
    phone: Optional[str] = None
    role: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str

    model_config = ConfigDict(from_attributes=True)


class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse
