from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, ConfigDict


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    role: str = "user"


class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: Optional[str] = "user"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: str
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None


# Feedback Schemas
class FeedbackCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5, description="1 to 5 star rating")
    feedback_text: str = Field(..., min_length=1, description="Feedback text content")
    customer_email: Optional[EmailStr] = None
    category: Optional[str] = None


class SentimentResponse(BaseModel):
    id: str
    feedback_id: str
    sentiment: str  # Positive, Neutral, Negative
    confidence_score: float
    summary: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TopicResponse(BaseModel):
    id: str
    feedback_id: str
    topic_name: str
    sentiment: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AlertResponse(BaseModel):
    id: str
    feedback_id: str
    alert_type: str
    status: str
    retry_count: int
    error_message: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class FeedbackResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    rating: int
    feedback_text: str
    customer_email: Optional[str] = None
    category: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime
    sentiment: Optional[SentimentResponse] = None
    topics: List[TopicResponse] = []
    alerts: List[AlertResponse] = []

    model_config = ConfigDict(from_attributes=True)


class FeedbackListResponse(BaseModel):
    items: List[FeedbackResponse]
    total: int
    skip: int
    limit: int


# Admin Insights Schemas
class SentimentDistribution(BaseModel):
    positive: int
    neutral: int
    negative: int
    positive_percentage: float
    neutral_percentage: float
    negative_percentage: float


class TopTopicItem(BaseModel):
    name: str
    count: int
    percentage: float
    sentiment: str


class TrendDataPoint(BaseModel):
    date: str
    positive: int
    neutral: int
    negative: int
    avg_rating: float


class InsightsResponse(BaseModel):
    total_feedback: int
    avg_rating: float
    sentiment_distribution: SentimentDistribution
    top_topics: List[TopTopicItem]
    historical_trends: List[TrendDataPoint]
