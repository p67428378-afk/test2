from pydantic import BaseModel, EmailStr, Field
from datetime import datetime


# Existing Password Reset Schemas (from origin/main)
class PasswordResetInitiateRequest(BaseModel):
    login_id: str
    mobile_number: str


class PasswordResetInitiateResponse(BaseModel):
    otp_session_id: str
    security_question: str


class OTPVerifyRequest(BaseModel):
    otp_code: str
    otp_session_id: str


class OTPVerifyResponse(BaseModel):
    security_question_session_id: str


class SecurityQuestionVerifyRequest(BaseModel):
    answer: str
    security_question_session_id: str


class SecurityQuestionVerifyResponse(BaseModel):
    password_reset_session_id: str


class SetNewPasswordRequest(BaseModel):
    new_password: str
    password_reset_session_id: str


class SetNewPasswordResponse(BaseModel):
    status: str
    login_link: str


# User Schemas
class UserRegister(BaseModel):
    email: EmailStr
    master_password: str = Field(
        ..., min_length=8, description="Strong master password"
    )


class UserLogin(BaseModel):
    email: EmailStr
    master_password: str


class UserResponse(BaseModel):
    id: str
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    derived_key_salt: str
    token_type: str = "bearer"


# Credential Schemas
class CredentialCreate(BaseModel):
    encrypted_data: str


class CredentialUpdate(BaseModel):
    encrypted_data: str


class CredentialResponse(BaseModel):
    id: str
    encrypted_data: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Password Generator Schemas
class PasswordGenerateRequest(BaseModel):
    length: int = Field(16, ge=4, le=128)
    include_uppercase: bool = True
    include_lowercase: bool = True
    include_numbers: bool = True
    include_symbols: bool = True


class PasswordGenerateResponse(BaseModel):
    password: str


# Import/Export Schemas
class VaultImportRequest(BaseModel):
    csv_data: str


class VaultImportResponse(BaseModel):
    detail: str
    imported_count: int


class VaultExportResponse(BaseModel):
    csv_data: str
