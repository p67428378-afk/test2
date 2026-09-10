from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict


# Category Schemas
class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None


class CategoryCreate(CategoryBase):
    pass


class CategoryResponse(CategoryBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    created_at: datetime
    updated_at: datetime


# MediaAsset Schemas
class MediaAssetBase(BaseModel):
    media_type: str = "image"
    url: str
    caption: Optional[str] = None


class MediaAssetCreate(MediaAssetBase):
    place_id: str


class MediaAssetResponse(MediaAssetBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    place_id: str
    created_at: datetime


# Review Schemas
class ReviewBase(BaseModel):
    user_name: str
    rating: int = Field(..., ge=1, le=5, description="Rating between 1 and 5 stars")
    comment: Optional[str] = None


class ReviewCreate(ReviewBase):
    place_id: str


class ReviewResponse(ReviewBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    place_id: str
    created_at: datetime


# Nearby Attraction Schema
class NearbyAttractionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    district: str
    cover_image_url: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    entry_fee: float
    avg_rating: float
    distance_km: float


# TouristPlace Schemas
class TouristPlaceBase(BaseModel):
    category_id: str
    title: str
    summary: Optional[str] = None
    description: Optional[str] = None
    district: str
    state_region: str = "Kerala"
    cover_image_url: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    best_time_to_visit: Optional[str] = None
    operating_hours: Optional[str] = None
    entry_fee: float = 0.0
    permit_requirements: Optional[str] = None


class TouristPlaceCreate(TouristPlaceBase):
    pass


class TouristPlaceResponse(TouristPlaceBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    avg_rating: float
    review_count: int
    created_at: datetime
    updated_at: datetime


class TouristPlaceDetailResponse(TouristPlaceResponse):
    category: Optional[CategoryResponse] = None
    media_assets: List[MediaAssetResponse] = []
    reviews: List[ReviewResponse] = []
    nearby_attractions: List[NearbyAttractionResponse] = []
