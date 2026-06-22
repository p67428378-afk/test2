from pydantic import BaseModel, Field
from typing import Optional, List
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


# Notes App Schemas


class AttachmentBase(BaseModel):
    id: UUID
    filename: str
    file_size: int
    file_path: str
    created_at: datetime

    class Config:
        from_attributes = True


class AttachmentResponse(AttachmentBase):
    note_id: UUID


class RecentAttachmentResponse(AttachmentBase):
    note_id: UUID
    note_title: str


class NoteCreateUpdate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    content: Optional[str] = None
    tags: List[str] = []


class NoteListResponse(BaseModel):
    id: UUID
    title: str
    content: Optional[str] = None
    tags: List[str] = []
    attachments_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class NoteDetailResponse(BaseModel):
    id: UUID
    title: str
    content: Optional[str] = None
    tags: List[str] = []
    attachments: List[AttachmentBase] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class NoteCreateUpdateResponse(BaseModel):
    id: UUID
    title: str
    content: Optional[str] = None
    tags: List[str] = []
    attachments: List[AttachmentBase] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class DeleteResponse(BaseModel):
    status: str = "success"


class StatsResponse(BaseModel):
    total_notes: int
    active_tags: int
    storage_usage_bytes: int
