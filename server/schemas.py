from datetime import datetime
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, EmailStr, Field, ConfigDict


# ---------------- User Schemas ----------------
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: str
    role: str
    is_active: bool
    is_verified: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Optional[UserResponse] = None


# ---------------- Category Schemas ----------------
class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None


class CategoryResponse(CategoryBase):
    id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ---------------- Curation Schemas ----------------
class CurationResponse(BaseModel):
    id: str
    box_id: str
    month_year: str
    theme_title: str
    highlights: Optional[str] = None
    item_list: List[Dict[str, Any]] = Field(default_factory=list)
    available_replacements: Optional[List[Dict[str, Any]]] = Field(default_factory=list)
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ---------------- Review Schemas ----------------
class ReviewCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    comment: str = Field(..., min_length=1)


class ReviewResponse(BaseModel):
    id: str
    box_id: str
    user_id: str
    rating: int
    comment: str
    created_at: datetime
    user_email: Optional[str] = None
    user_name: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class ReviewListResponse(BaseModel):
    reviews: List[ReviewResponse]
    total: int
    skip: int
    limit: int


# ---------------- Box Schemas ----------------
class BoxListItem(BaseModel):
    id: str
    title: str
    slug: str
    category_id: str
    category_name: Optional[str] = None
    description: Optional[str] = None
    price: float
    billing_frequency: str
    image_url: Optional[str] = None
    average_rating: float
    total_reviews: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class BoxListResponse(BaseModel):
    items: List[BoxListItem]
    total: int
    skip: int
    limit: int


class BoxDetail(BaseModel):
    id: str
    title: str
    slug: str
    category_id: str
    category_name: Optional[str] = None
    description: Optional[str] = None
    price: float
    billing_frequency: str
    image_url: Optional[str] = None
    average_rating: float
    total_reviews: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    curations: List[CurationResponse] = Field(default_factory=list)
    reviews: List[ReviewResponse] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)


# ---------------- Gift Subscription Schemas ----------------
class GiftSubscriptionCreate(BaseModel):
    recipient_email: EmailStr
    message: Optional[str] = Field(None, max_length=500)


class GiftSubscriptionResponse(BaseModel):
    id: str
    box_id: str
    sender_id: Optional[str] = None
    recipient_email: str
    message: Optional[str] = None
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ---------------- Box Customization Schemas ----------------
class CustomizationOption(BaseModel):
    box_id: str
    curation_id: str
    curation_theme: str
    max_swaps_allowed: int = 1
    current_items: List[Dict[str, Any]] = Field(default_factory=list)
    available_replacements: List[Dict[str, Any]] = Field(default_factory=list)


class CustomizationRequest(BaseModel):
    original_item_id: str
    replacement_item_id: str


class CustomizationResponse(BaseModel):
    id: str
    box_id: str
    curation_id: str
    user_id: Optional[str] = None
    original_item_id: str
    replacement_item_id: str
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
