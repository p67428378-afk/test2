from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "user"


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


class TokenData(BaseModel):
    email: Optional[str] = None


# Item Image Schemas
class ItemImageCreate(BaseModel):
    image_url: str
    file_size_mb: float


class ItemImageResponse(BaseModel):
    id: str
    image_url: str
    file_size_mb: float
    created_at: datetime

    class Config:
        from_attributes = True


# Item Schemas
class ItemBase(BaseModel):
    type: str = Field(..., description="'lost' or 'found'")
    category: str
    name: str
    description: str
    location: str
    date_incident: datetime
    contact_info: str


class ItemCreate(ItemBase):
    images: Optional[List[ItemImageCreate]] = []


class ItemResponse(ItemBase):
    id: str
    reporter_id: str
    status: str
    created_at: datetime
    updated_at: datetime
    images: List[ItemImageResponse] = []

    class Config:
        from_attributes = True


# Claim Schemas
class ClaimBase(BaseModel):
    item_id: str
    proof_of_ownership: str


class ClaimCreate(ClaimBase):
    pass


class ClaimResponse(ClaimBase):
    id: str
    claimant_id: str
    status: str
    rejection_reason: Optional[str] = None
    admin_notes: Optional[str] = None
    reviewed_by: Optional[str] = None
    reviewed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ClaimVerifyRequest(BaseModel):
    status: str = Field(..., description="'approved' or 'rejected'")
    rejection_reason: Optional[str] = None
    admin_notes: Optional[str] = None


# Claim History Schemas
class ClaimHistoryResponse(BaseModel):
    id: str
    item_id: str
    claim_id: Optional[str] = None
    actor_id: str
    action: str
    details: str
    created_at: datetime

    class Config:
        from_attributes = True


# Match Schemas
class MatchResponse(BaseModel):
    matched_item: ItemResponse
    similarity_score: float
