from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    email: EmailStr


class UserRegister(UserBase):
    password: str
    role: Optional[str] = "user"


class UserResponse(UserBase):
    id: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class ItemImageResponse(BaseModel):
    id: str
    image_url: str

    class Config:
        from_attributes = True


class ItemCreate(BaseModel):
    type: str = Field(..., description="Must be 'lost' or 'found'")
    category: str
    description: str
    location: Optional[str] = None
    item_timestamp: Optional[datetime] = None
    images: Optional[List[str]] = []


class ItemResponse(BaseModel):
    id: str
    user_id: str
    type: str
    category: str
    description: str
    location: Optional[str] = None
    item_timestamp: Optional[datetime] = None
    status: str
    images: List[ItemImageResponse] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ItemListResponse(BaseModel):
    items: List[ItemResponse]
    total: int


class MatchSuggestionResponse(BaseModel):
    id: str
    lost_item_id: str
    found_item_id: str
    confidence_score: float
    status: str
    matched_item: ItemResponse
    created_at: datetime

    class Config:
        from_attributes = True


class ClaimCreate(BaseModel):
    item_id: str
    proof: Optional[str] = None


class ClaimVerify(BaseModel):
    status: str = Field(..., description="Must be 'approved' or 'rejected'")
    notes: Optional[str] = None


class ClaimResponse(BaseModel):
    id: str
    item_id: str
    claimant_id: str
    status: str
    proof: Optional[str] = None
    admin_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ClaimHistoryResponse(BaseModel):
    id: str
    claim_id: str
    event_type: str
    notes: Optional[str] = None
    performed_by_id: str
    created_at: datetime

    class Config:
        from_attributes = True
