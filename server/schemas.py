from datetime import date, datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field


# Product Schemas
class ProductCreate(BaseModel):
    product_name: str
    serial_number: str
    purchase_date: date
    duration_months: int = Field(..., ge=1)
    brand: Optional[str] = None
    category: Optional[str] = None
    vendor_name: Optional[str] = None


class ProductUpdate(BaseModel):
    product_name: Optional[str] = None
    brand: Optional[str] = None
    category: Optional[str] = None
    vendor_name: Optional[str] = None


class WarrantyResponse(BaseModel):
    id: str
    product_id: str
    duration_months: int
    start_date: date
    end_date: date
    status: str
    vendor_name: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class ReceiptResponse(BaseModel):
    id: str
    product_id: str
    file_name: str
    file_path: str
    mime_type: str
    file_size_bytes: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProductResponse(BaseModel):
    id: str
    product_name: str
    serial_number: str
    brand: Optional[str] = None
    category: Optional[str] = None
    purchase_date: date
    created_at: datetime
    updated_at: datetime
    warranty: Optional[WarrantyResponse] = None
    receipts: List[ReceiptResponse] = []

    model_config = ConfigDict(from_attributes=True)


# Claim Schemas
class ClaimCreate(BaseModel):
    product_id: str
    claim_date: date
    issue_description: str
    service_provider: Optional[str] = None


class ClaimStatusUpdate(BaseModel):
    status: str  # PENDING, APPROVED, REJECTED, COMPLETED
    resolution_notes: Optional[str] = None
    repair_cost: Optional[float] = 0.0


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


class ClaimResponse(BaseModel):
    id: str
    product_id: str
    claim_date: date
    issue_description: str
    status: str
    service_provider: Optional[str] = None
    repair_cost: float
    resolution_notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    audit_logs: List[ClaimAuditLogResponse] = []

    model_config = ConfigDict(from_attributes=True)


# Notification / Stats Schemas
class WarrantyStats(BaseModel):
    total_products: int
    active: int
    expiring_soon: int
    expired: int
