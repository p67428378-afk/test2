from typing import List, Optional, Any, Dict
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, ConfigDict

MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 * 1024  # 5GB


# ================= User / Auth Schemas =================
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "Investigator"


class UserRegisterRequest(UserBase):
    password: str = Field(..., min_length=6)


class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserResponse"


class UserResponse(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    is_active: bool
    created_at: datetime
    updated_at: datetime


class UserRoleUpdateRequest(BaseModel):
    role: str


# ================= Evidence Schemas =================
class EvidenceUploadURLRequest(BaseModel):
    evidence_code: Optional[str] = None
    file_name: str
    file_type: str
    file_size_bytes: int = Field(
        ..., gt=0, le=MAX_FILE_SIZE_BYTES, description="File size up to 5GB"
    )
    collection_date: Optional[datetime] = None
    collection_location: Optional[str] = None
    source_device: Optional[str] = None
    case_id: Optional[str] = None


class EvidenceUploadURLResponse(BaseModel):
    evidence_id: str
    evidence_code: str
    upload_url: str
    storage_path: str
    expires_in_seconds: int = 3600


class EvidenceConfirmUploadRequest(BaseModel):
    evidence_id: str
    sha256_hash: str
    file_size_bytes: int = Field(
        ..., gt=0, le=MAX_FILE_SIZE_BYTES, description="File size up to 5GB"
    )
    transfer_reason: Optional[str] = (
        "Initial evidence upload and cryptographic SHA-256 verification"
    )
    location_context: Optional[str] = None


class EvidenceItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    evidence_code: str
    file_name: str
    file_type: str
    file_size_bytes: int
    sha256_hash: str
    storage_path: str
    collection_date: datetime
    collection_location: Optional[str] = None
    source_device: Optional[str] = None
    current_custodian_id: Optional[str] = None
    current_custodian: Optional[UserResponse] = None
    created_at: datetime
    updated_at: datetime
    assigned_case_ids: List[str] = []


class EvidenceListResponse(BaseModel):
    total: int
    items: List[EvidenceItemResponse]


class EvidenceVerificationResponse(BaseModel):
    evidence_id: str
    evidence_code: str
    expected_hash: str
    calculated_hash: str
    is_valid: bool
    verified_at: datetime
    message: str


# ================= Chain of Custody Schemas =================
class ChainOfCustodyTransferRequest(BaseModel):
    evidence_id: str
    new_custodian_id: str
    transfer_reason: str
    location_context: Optional[str] = None
    departing_signoff: bool = True
    receiving_signoff: bool = True


class ChainOfCustodyActionRequest(BaseModel):
    evidence_id: str
    action: str  # VIEW, EXPORT, RELEASE
    reason: str
    location_context: Optional[str] = None


class ChainOfCustodyEntryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    evidence_id: str
    previous_custodian_id: Optional[str] = None
    previous_custodian: Optional[UserResponse] = None
    new_custodian_id: str
    new_custodian: Optional[UserResponse] = None
    action: str
    transfer_reason: str
    location_context: Optional[str] = None
    timestamp: datetime


class ChainOfCustodyHistoryResponse(BaseModel):
    evidence_id: str
    evidence_code: str
    total_entries: int
    history: List[ChainOfCustodyEntryResponse]


# ================= Case Schemas =================
class CaseBase(BaseModel):
    case_number: str
    title: str
    description: Optional[str] = None
    status: str = "Active"


class CaseCreateRequest(CaseBase):
    lead_investigator_id: Optional[str] = None


class CaseUpdateRequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    lead_investigator_id: Optional[str] = None


class CaseResponse(CaseBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    lead_investigator_id: Optional[str] = None
    lead_investigator: Optional[UserResponse] = None
    evidence_count: int = 0
    created_at: datetime
    updated_at: datetime


class CaseDetailResponse(CaseResponse):
    evidence_items: List[EvidenceItemResponse] = []


class AssignEvidenceRequest(BaseModel):
    evidence_ids: List[str]


class CaseStatsSummaryResponse(BaseModel):
    active_cases: int
    total_cases: int
    total_evidence_items: int
    pending_transfers: int
    unassigned_artifacts: int


# ================= Audit Log Schemas =================
class AuditLogResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: Optional[str] = None
    user_email: Optional[str] = None
    action: str
    resource: str
    status_code: int
    ip_address: str
    details: Optional[Dict[str, Any]] = None
    timestamp: datetime


class AuditLogListResponse(BaseModel):
    total: int
    items: List[AuditLogResponse]


# ================= RBAC Schemas =================
class RoleCapability(BaseModel):
    role: str
    upload_evidence: str
    view_evidence_ledger: str
    transfer_custody: str
    assign_to_case: str
    view_audit_logs: str
    admin_user_mgmt: str


class RBACMatrixResponse(BaseModel):
    roles: List[str]
    capabilities: List[RoleCapability]
