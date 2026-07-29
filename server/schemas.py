from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime, date
from typing import List, Optional

# --- Auth Schemas ---


class UserRegister(BaseModel):
    email: str
    full_name: str
    password: str
    role: Optional[str] = "user"


class UserResponse(BaseModel):
    id: UUID
    email: str
    full_name: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    username: str
    password: str


class LoginResponseUser(BaseModel):
    id: UUID
    email: str
    full_name: str
    role: str

    class Config:
        from_attributes = True


class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: LoginResponseUser


# --- Item Schemas ---


class ItemImageResponse(BaseModel):
    id: UUID
    image_url: str
    created_at: datetime

    class Config:
        from_attributes = True


class ItemCreate(BaseModel):
    name: str
    description: Optional[str] = None
    category: str
    location_text: str
    lat: Optional[float] = None
    lon: Optional[float] = None
    status: str = Field(..., description="reported_lost or reported_found")
    item_date: date
    image_url: Optional[str] = None


class ItemResponse(BaseModel):
    id: UUID
    user_id: UUID
    name: str
    description: Optional[str]
    category: str
    location_text: str
    lat: Optional[float]
    lon: Optional[float]
    status: str
    item_date: date
    images: List[ItemImageResponse] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class FoundItemsResponse(BaseModel):
    items: List[ItemResponse]
    total: int


# --- AI Matching Schemas ---


class MatchItemDetail(BaseModel):
    id: UUID
    name: str
    description: Optional[str]
    category: str
    location_text: str
    status: str
    item_date: date

    class Config:
        from_attributes = True


class MatchResponseItem(BaseModel):
    item: MatchItemDetail
    score: float


class AIMatchesResponse(BaseModel):
    matches: List[MatchResponseItem]


# --- Claim Schemas ---


class ClaimCreate(BaseModel):
    item_id: UUID
    claimant_description: str


class ClaimResponse(BaseModel):
    id: UUID
    item_id: UUID
    user_id: UUID
    claimant_description: str
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# --- Admin Schemas ---


class AdminClaimItemDetail(BaseModel):
    name: str
    status: str

    class Config:
        from_attributes = True


class AdminClaimUserDetail(BaseModel):
    email: str
    full_name: str

    class Config:
        from_attributes = True


class AdminClaimResponseItem(BaseModel):
    id: UUID
    item_id: UUID
    user_id: UUID
    claimant_description: str
    status: str
    created_at: datetime
    updated_at: datetime
    item: AdminClaimItemDetail
    user: AdminClaimUserDetail

    class Config:
        from_attributes = True


class AdminClaimsResponse(BaseModel):
    claims: List[AdminClaimResponseItem]
    total: int


class AdminUpdateClaimStatus(BaseModel):
    status: str = Field(..., description="approved, rejected, or more_info_requested")


class AdminItemResponseItem(BaseModel):
    id: UUID
    name: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class AdminItemsResponse(BaseModel):
    items: List[AdminItemResponseItem]
    total: int


class AdminUsersResponse(BaseModel):
    users: List[UserResponse]
    total: int
