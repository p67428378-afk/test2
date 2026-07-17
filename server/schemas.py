from pydantic import BaseModel, Field
from typing import Dict, Any, Optional
from datetime import datetime


# --- Original Password Reset Schemas ---
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


# --- New Schema Registry Schemas ---
class SchemaSubjectBase(BaseModel):
    name: str
    compatibility_level: str = "BACKWARD"


class SchemaSubjectCreate(SchemaSubjectBase):
    pass


class SchemaSubjectResponse(SchemaSubjectBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SchemaVersionCreate(BaseModel):
    schema_definition: str = Field(..., description="JSON string of Avro schema")


class SchemaVersionResponse(BaseModel):
    id: str
    subject: str
    version: int
    schema_definition: Dict[str, Any]
    created_at: datetime

    class Config:
        from_attributes = True


class SchemaVersionListResponse(BaseModel):
    id: str
    subject_id: str
    version: int
    schema_definition: Dict[str, Any]
    created_at: datetime

    class Config:
        from_attributes = True


class ConfigUpdate(BaseModel):
    compatibility_level: str


class ValidationLogResponse(BaseModel):
    id: str
    timestamp: datetime
    subject: str
    attempted_version: str
    change_type: str
    compatibility_level: str
    status: str
    error_details: Optional[str] = None

    class Config:
        from_attributes = True
