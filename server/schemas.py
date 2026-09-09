"""Pydantic schemas for request and response validation."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

# ==========================================
# Product Schemas
# ==========================================


class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: str | None = None
    category: str = Field(..., min_length=1, max_length=100)
    price: float = Field(..., ge=0.0)
    rating: float = Field(default=0.0, ge=0.0, le=5.0)
    tags: list[str] = Field(default_factory=list)
    in_stock: bool = True


class ProductCreate(ProductBase):
    pass


class ProductResponse(ProductBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProductListResponse(BaseModel):
    items: list[ProductResponse]
    total: int
    skip: int
    limit: int


# ==========================================
# User Preference Schemas
# ==========================================


class UserPreferenceCreate(BaseModel):
    user_id: str | None = None
    category_preferences: list[str] = Field(default_factory=list)
    min_price: float = Field(default=0.0, ge=0.0)
    max_price: float = Field(default=10000.0, ge=0.0)
    preferred_tags: list[str] = Field(default_factory=list)


class UserPreferenceResponse(BaseModel):
    id: str
    user_id: str
    category_preferences: list[str]
    min_price: float
    max_price: float
    preferred_tags: list[str]
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ==========================================
# Recommendation Schemas
# ==========================================


class RecommendationGenerateRequest(BaseModel):
    user_id: str = Field(..., min_length=1)
    limit: int = Field(default=5, ge=1, le=50)
    min_rating: float | None = Field(default=None, ge=0.0, le=5.0)
    sort_by: str | None = Field(
        default="match_score", pattern="^(match_score|price|rating)$"
    )
    sort_order: str | None = Field(default="desc", pattern="^(asc|desc)$")


class RecommendationItemProduct(BaseModel):
    id: str
    name: str
    category: str
    price: float
    rating: float
    description: str | None = None
    tags: list[str] | None = None

    model_config = ConfigDict(from_attributes=True)


class RecommendationItemResponse(BaseModel):
    recommendation_id: str
    product: RecommendationItemProduct
    match_score: float
    recommendation_type: str = "ai_vector"


class RecommendationGenerateResponse(BaseModel):
    user_id: str
    session_id: str
    recommendations: list[RecommendationItemResponse]


# ==========================================
# Feedback Schemas
# ==========================================


class FeedbackCreate(BaseModel):
    recommendation_id: str = Field(..., min_length=1)
    user_id: str = Field(..., min_length=1)
    feedback: str = Field(..., pattern="^(like|dislike)$")


class FeedbackResponse(BaseModel):
    id: str
    recommendation_id: str
    feedback: str
    status: str = "updated"


# ==========================================
# Saved Items Schemas
# ==========================================


class SavedItemCreate(BaseModel):
    user_id: str = Field(..., min_length=1)
    product_id: str = Field(..., min_length=1)
    recommendation_id: str | None = None


class SavedProductInfo(BaseModel):
    id: str | None = None
    name: str
    price: float
    rating: float
    category: str
    description: str | None = None
    tags: list[str] | None = None

    model_config = ConfigDict(from_attributes=True)


class SavedItemResponse(BaseModel):
    id: str
    user_id: str | None = None
    product_id: str
    recommendation_id: str | None = None
    product: SavedProductInfo | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class SavedItemListResponse(BaseModel):
    items: list[SavedItemResponse]
    total: int
    skip: int
    limit: int


class SavedItemDeleteResponse(BaseModel):
    status: str = "deleted"
    saved_id: str


# ==========================================
# History Schemas
# ==========================================


class HistoryItem(BaseModel):
    recommendation_id: str
    product_name: str
    match_score: float
    feedback: str | None = None


class HistorySession(BaseModel):
    session_id: str
    timestamp: datetime
    total_recommendations: int
    items: list[HistoryItem]


class HistoryListResponse(BaseModel):
    sessions: list[HistorySession]
    total: int
    skip: int
    limit: int
