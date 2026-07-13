from pydantic import BaseModel, Field
from typing import Optional
import datetime


# Auth Schemas
class UserRegister(BaseModel):
    username: str = Field(..., description="User's chosen username or email")
    master_password: str = Field(..., description="User's master password")


class UserResponse(BaseModel):
    id: str
    username: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    username: str
    master_password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "Bearer"


# Credential Schemas
class CredentialCreate(BaseModel):
    title: str = Field(..., description="Title of the credential")
    username: str = Field(..., description="Encrypted username")
    password: str = Field(..., description="Encrypted password")
    url: Optional[str] = Field(None, description="Encrypted URL")
    notes: Optional[str] = Field(None, description="Encrypted notes")


class CredentialUpdate(BaseModel):
    title: Optional[str] = Field(None, description="Title of the credential")
    username: Optional[str] = Field(None, description="Encrypted username")
    password: Optional[str] = Field(None, description="Encrypted password")
    url: Optional[str] = Field(None, description="Encrypted URL")
    notes: Optional[str] = Field(None, description="Encrypted notes")


class CredentialResponse(BaseModel):
    id: str
    title: str
    username: str
    password: str
    url: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime.datetime
    updated_at: datetime.datetime

    class Config:
        from_attributes = True


# Password Generator Schemas
class PasswordGenerateRequest(BaseModel):
    length: int = Field(16, ge=8, le=128, description="Length of the password")
    lowercase: bool = Field(True, description="Include lowercase letters")
    uppercase: bool = Field(True, description="Include uppercase letters")
    numbers: bool = Field(True, description="Include numbers")
    symbols: bool = Field(True, description="Include symbols")


class PasswordGenerateResponse(BaseModel):
    password: str
    strength: str
