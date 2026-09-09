from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ProductBase(BaseModel):
    name: str
    description: str | None = None
    category: str
    price: float
    rating: float = 0.0
    tags: list[str] = Field(default_factory=list)
    in_stock: bool = True


class ProductCreate(ProductBase):
    pass


class ProductResponse(ProductBase):
    id: str
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class ProductListResponse(BaseModel):
    items: list[ProductResponse]
    total: int
    skip: int
    limit: int


class PreferenceCreate(BaseModel):
    user_id: str = Field(..., min_length=1)
    category_preferences: list[str] = Field(default_factory=list)
    min_price: float = Field(0.0, ge=0.0)
    max_price: float = Field(1000.0, ge=0.0)
    preferred_tags: list[str] = Field(default_factory=list)


class PreferenceResponse(BaseModel):
    id: str
    user_id: str
    category_preferences: list[str]
    min_price: float
    max_price: float
    preferred_tags: list[str]
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class RecommendationGenerateRequest(BaseModel):
    user_id: str = Field(..., min_length=1)
    limit: int | None = Field(5, ge=1, le=50)


class RecommendationItem(BaseModel):
    recommendation_id: str
    product: ProductResponse
    match_score: float
    recommendation_type: str = "ai_vector"


class RecommendationListResponse(BaseModel):
    user_id: str
    recommendations: list[RecommendationItem]


class FeedbackCreate(BaseModel):
    recommendation_id: str = Field(..., min_length=1)
    user_id: str = Field(..., min_length=1)
    feedback: str = Field(..., pattern="^(like|dislike)$")


class FeedbackResponse(BaseModel):
    id: str
    recommendation_id: str
    feedback: str
    status: str = "updated"

    model_config = ConfigDict(from_attributes=True)
