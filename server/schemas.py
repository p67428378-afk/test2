"""
Module: server.schemas
Purpose: Pydantic schemas for request/response validation and serialization.
"""

from datetime import date, datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr


# --- User Schemas ---
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True


# --- Auth Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


# --- Receipt Schemas ---
class ReceiptResponse(BaseModel):
    id: str
    filename: str
    file_url: str

    class Config:
        from_attributes = True


# --- Warranty Schemas ---
class WarrantyResponse(BaseModel):
    id: str
    duration_months: Optional[int] = None
    is_lifetime: bool
    expiry_date: Optional[date] = None
    status: str

    class Config:
        from_attributes = True


# --- Claim Schemas ---
class ClaimCreate(BaseModel):
    product_id: str
    claim_date: date
    issue_description: str
    service_cost: float = 0.0


class ClaimUpdate(BaseModel):
    status: str
    resolution_notes: Optional[str] = None
    service_cost: Optional[float] = None


class ClaimResponse(BaseModel):
    id: str
    product_id: str
    claim_date: date
    issue_description: str
    status: str
    resolution_notes: Optional[str] = None
    service_cost: float

    class Config:
        from_attributes = True


# --- Product Schemas ---
class ProductCreate(BaseModel):
    name: str
    serial_number: str
    manufacturer: str
    category: str
    purchase_date: date
    warranty_duration_months: Optional[int] = None
    is_lifetime: bool = False
    receipt_id: Optional[str] = None


class ProductResponse(BaseModel):
    id: str
    name: str
    serial_number: str
    manufacturer: str
    category: str
    purchase_date: date
    warranty: Optional[WarrantyResponse] = None
    receipt: Optional[ReceiptResponse] = None
    claims: List[ClaimResponse] = []

    class Config:
        from_attributes = True


class ProductListResponse(BaseModel):
    total: int
    items: List[ProductResponse]
