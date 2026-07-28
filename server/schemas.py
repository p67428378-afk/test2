from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional, Any


# Auth Schemas
class UserRegister(BaseModel):
    username: str
    password: str
    role_name: str


class UserRegisterResponse(BaseModel):
    id: UUID
    username: str
    role_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    username: str
    password: str


class UserLoginResponseUser(BaseModel):
    id: UUID
    username: str
    role: str


class UserLoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserLoginResponseUser


# Evidence Schemas
class EvidenceUploadRequest(BaseModel):
    filename: str
    file_type: str
    file_size: int
    sha256_hash: str
    case_id: Optional[UUID] = None


class EvidenceUploadResponse(BaseModel):
    id: UUID
    filename: str
    storage_path: str
    upload_url: str

    class Config:
        from_attributes = True


class EvidenceResponse(BaseModel):
    id: UUID
    filename: str
    file_type: str
    file_size: int
    sha256_hash: str
    storage_path: str
    uploaded_by_id: UUID
    case_id: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Case Schemas
class CaseCreate(BaseModel):
    case_number: str
    description: Optional[str] = None


class CaseResponse(BaseModel):
    id: UUID
    case_number: str
    description: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CaseListResponse(BaseModel):
    id: UUID
    case_number: str
    description: Optional[str] = None
    evidence_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CaseEvidenceResponse(BaseModel):
    id: UUID
    filename: str
    file_type: str
    file_size: int
    sha256_hash: str
    uploaded_by: str
    created_at: datetime

    class Config:
        from_attributes = True


class AssignEvidenceRequest(BaseModel):
    evidence_id: UUID


class AssignEvidenceResponse(BaseModel):
    id: UUID
    filename: str
    case_id: UUID

    class Config:
        from_attributes = True


# Audit & Chain of Custody Schemas
class AuditLogResponse(BaseModel):
    id: UUID
    user_id: Optional[UUID] = None
    username: Optional[str] = None
    action: str
    details: Optional[Any] = None
    timestamp: datetime

    class Config:
        from_attributes = True


class ChainOfCustodyResponse(BaseModel):
    id: UUID
    evidence_id: UUID
    user_id: UUID
    username: str
    action: str
    details: Optional[Any] = None
    timestamp: datetime

    class Config:
        from_attributes = True
