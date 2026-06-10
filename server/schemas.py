from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID


# Existing schemas
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


# New schemas for Paper Management System


class ManuscriptUploadResponse(BaseModel):
    manuscript_id: UUID
    title: Optional[str] = None
    abstract: Optional[str] = None
    file_path: Optional[str] = None
    status: str

    class Config:
        from_attributes = True


class ManuscriptResponse(BaseModel):
    manuscript_id: UUID
    title: Optional[str] = None
    abstract: Optional[str] = None
    file_path: Optional[str] = None
    creator_id: UUID
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ManuscriptUpdateRequest(BaseModel):
    title: Optional[str] = None
    abstract: Optional[str] = None
    status: Optional[str] = None


class CollaboratorInviteRequest(BaseModel):
    email: str
    role: str


class CollaboratorResponse(BaseModel):
    author_id: UUID
    manuscript_id: UUID
    email: str
    role: str
    status: str

    class Config:
        from_attributes = True


class ComplianceCheckRequest(BaseModel):
    stylesheet_id: UUID


class ComplianceCheckResponse(BaseModel):
    status: str
    errors: List[str]
    warnings: List[str]


class StylesheetResponse(BaseModel):
    stylesheet_id: UUID
    name: str
    rules: Dict[str, Any]

    class Config:
        from_attributes = True


class RevisionResponse(BaseModel):
    revision_id: UUID
    manuscript_id: UUID
    reviewer_comment: str
    author_rebuttal: Optional[str] = None
    text_link: Optional[str] = None

    class Config:
        from_attributes = True


class RebuttalRequest(BaseModel):
    author_rebuttal: str
    text_link: str
