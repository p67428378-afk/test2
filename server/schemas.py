from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, date


# User Schemas
class UserBase(BaseModel):
    email: str
    is_admin: Optional[bool] = False


class UserRegister(UserBase):
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


class UserResponse(UserBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        orm_mode = True


# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


# Item Image Schemas
class ItemImageBase(BaseModel):
    image_url: str


class ItemImageCreate(ItemImageBase):
    pass


class ItemImageResponse(ItemImageBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True
        orm_mode = True


# Item Schemas
class ItemBase(BaseModel):
    item_type: str  # 'lost' or 'found'
    category: str
    color: Optional[str] = None
    brand: Optional[str] = None
    description: str
    location: str
    item_date: date


class ItemCreate(ItemBase):
    image_urls: Optional[List[str]] = []


class ItemResponse(ItemBase):
    id: str
    user_id: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime
    images: List[ItemImageResponse] = []

    class Config:
        from_attributes = True
        orm_mode = True


# Match Schemas
class MatchResponse(BaseModel):
    matched_item_id: str
    similarity_score: float
    category: str
    color: Optional[str] = None
    brand: Optional[str] = None
    location: str
    item_date: date
    image_url: Optional[str] = None


# Claim Schemas
class ClaimCreate(BaseModel):
    item_id: str


class ClaimResponse(BaseModel):
    id: str
    item_id: str
    claimant_id: str
    verifier_id: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        orm_mode = True


class ClaimVerify(BaseModel):
    status: str  # 'approved' or 'rejected'


# Message Schemas
class MessageCreate(BaseModel):
    text: str


class MessageResponse(BaseModel):
    id: str
    claim_id: str
    sender_id: str
    text: str
    created_at: datetime

    class Config:
        from_attributes = True
        orm_mode = True
