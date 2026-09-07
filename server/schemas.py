from datetime import datetime
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, ConfigDict, Field, EmailStr


class UserBase(BaseModel):
    email: EmailStr
    full_name: str


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: str
    role: str
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class CategorySchema(BaseModel):
    id: str
    name: str
    slug: str
    description: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class CurationItem(BaseModel):
    name: str
    description: str
    value: str


class CurationSchema(BaseModel):
    id: str
    month_year: str
    theme_title: str
    highlights: str
    item_list: List[Dict[str, Any]] = []

    model_config = ConfigDict(from_attributes=True)


class ReviewCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5, description="Rating between 1 and 5 stars")
    comment: str = Field(..., min_length=1, description="Written review feedback")


class ReviewSchema(BaseModel):
    id: str
    box_id: str
    user_id: str
    user_name: Optional[str] = None
    rating: int
    comment: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ReviewListResponse(BaseModel):
    reviews: List[ReviewSchema]
    total: int
    skip: int = 0
    limit: int = 20


class BoxSummary(BaseModel):
    id: str
    title: str
    slug: str
    category_id: str
    category_name: Optional[str] = None
    price: float
    billing_frequency: str
    image_url: Optional[str] = None
    average_rating: float = 0.0
    total_reviews: int = 0
    is_active: bool = True

    model_config = ConfigDict(from_attributes=True)


class BoxDetail(BaseModel):
    id: str
    category_id: str
    category_name: Optional[str] = None
    title: str
    slug: str
    description: str
    price: float
    billing_frequency: str
    image_url: Optional[str] = None
    average_rating: float = 0.0
    total_reviews: int = 0
    is_active: bool = True
    curations: List[CurationSchema] = []
    reviews: List[ReviewSchema] = []

    model_config = ConfigDict(from_attributes=True)


class BoxListResponse(BaseModel):
    items: List[BoxSummary]
    total: int
    skip: int = 0
    limit: int = 20
