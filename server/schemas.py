import uuid
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, field_validator


# Image Schemas
class ItemImageBase(BaseModel):
    image_url: str


class ItemImageResponse(ItemImageBase):
    id: uuid.UUID

    class Config:
        from_attributes = True


# Item Schemas
class ItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    category: str
    location: str
    report_date: datetime
    contact_info: str
    status: str

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        if v not in ("lost", "found"):
            raise ValueError("Status must be either 'lost' or 'found'")
        return v


class ItemCreate(ItemBase):
    image_urls: Optional[List[str]] = Field(default=None, max_length=3)


class ItemResponse(ItemBase):
    id: uuid.UUID
    images: List[ItemImageResponse] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Match Schemas
class MatchItemDetails(BaseModel):
    id: uuid.UUID
    name: str
    description: Optional[str] = None
    category: str
    location: str
    report_date: datetime
    status: str
    images: List[ItemImageResponse] = []

    class Config:
        from_attributes = True


class MatchResponse(BaseModel):
    item: MatchItemDetails
    score: float


# Claim Schemas
class ClaimBase(BaseModel):
    item_id: uuid.UUID
    claimant_details: str
    claim_date: datetime


class ClaimCreate(ClaimBase):
    pass


class ClaimItemBrief(BaseModel):
    id: uuid.UUID
    name: str
    status: str

    class Config:
        from_attributes = True


class ClaimResponse(ClaimBase):
    id: uuid.UUID
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ClaimListResponse(ClaimResponse):
    item: ClaimItemBrief

    class Config:
        from_attributes = True


class ClaimDetailResponse(ClaimResponse):
    item: ItemResponse

    class Config:
        from_attributes = True


class ClaimVerifyRequest(BaseModel):
    status: str

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        if v not in ("approved", "rejected"):
            raise ValueError("Status must be either 'approved' or 'rejected'")
        return v


# Admin Schemas
class AdminItemResponse(BaseModel):
    id: uuid.UUID
    name: str
    category: str
    location: str
    report_date: datetime
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class AdminClaimResponse(BaseModel):
    id: uuid.UUID
    item_id: uuid.UUID
    claimant_details: str
    claim_date: datetime
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
