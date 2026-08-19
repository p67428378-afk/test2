from datetime import date, datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field


class WarrantyBase(BaseModel):
    duration_months: int = Field(..., ge=1)
    vendor_name: Optional[str] = None


class WarrantyCreate(WarrantyBase):
    pass


class WarrantyResponse(WarrantyBase):
    id: str
    product_id: str
    start_date: date
    end_date: date
    status: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class ProductBase(BaseModel):
    product_name: str
    serial_number: str
    brand: Optional[str] = None
    category: Optional[str] = None
    purchase_date: date


class ProductCreate(ProductBase):
    duration_months: int = Field(12, ge=1)
    vendor_name: Optional[str] = None


class ProductUpdate(BaseModel):
    product_name: Optional[str] = None
    serial_number: Optional[str] = None
    brand: Optional[str] = None
    category: Optional[str] = None
    purchase_date: Optional[date] = None
    duration_months: Optional[int] = Field(None, ge=1)
    vendor_name: Optional[str] = None


class ReceiptResponse(BaseModel):
    id: str
    product_id: str
    file_name: str
    file_path: str
    mime_type: str
    file_size_bytes: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ClaimAuditLogResponse(BaseModel):
    id: str
    claim_id: str
    action: str
    from_status: Optional[str] = None
    to_status: str
    performed_by: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ClaimBase(BaseModel):
    product_id: str
    claim_date: date
    issue_description: str
    service_provider: Optional[str] = None


class ClaimCreate(ClaimBase):
    pass


class ClaimStatusUpdate(BaseModel):
    status: str
    repair_cost: Optional[float] = 0.0
    resolution_notes: Optional[str] = None


class ClaimResponse(BaseModel):
    id: str
    product_id: str
    claim_date: date
    issue_description: str
    status: str
    service_provider: Optional[str] = None
    repair_cost: Optional[float] = 0.0
    resolution_notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    audit_logs: List[ClaimAuditLogResponse] = []

    model_config = ConfigDict(from_attributes=True)


class ProductResponse(ProductBase):
    id: str
    user_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    warranty: Optional[WarrantyResponse] = None
    claims: List[ClaimResponse] = []
    receipts: List[ReceiptResponse] = []

    model_config = ConfigDict(from_attributes=True)


class WarrantyStatsResponse(BaseModel):
    total_products: int
    active: int
    expiring_soon: int
    expired: int


class UserBase(BaseModel):
    email: str
    full_name: str


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: str
    is_active: bool
    is_verified: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None
