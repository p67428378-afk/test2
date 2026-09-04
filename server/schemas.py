from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict


class UserBase(BaseModel):
    email: str
    role: Optional[str] = "user"


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: str
    email: str
    role: str
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


class TopicResponse(BaseModel):
    id: str
    topic_name: str
    confidence: float

    model_config = ConfigDict(from_attributes=True)


class SentimentResponse(BaseModel):
    id: str
    sentiment: str
    score: float
    processed_at: datetime

    model_config = ConfigDict(from_attributes=True)


class FeedbackCreate(BaseModel):
    feedback_text: str = Field(..., min_length=1, max_length=1000)
    rating: int = Field(..., ge=1, le=5)
    customer_email: Optional[str] = None


class FeedbackResponse(BaseModel):
    id: str
    feedback_text: str
    rating: int
    customer_email: Optional[str] = None
    analysis_status: str
    created_at: datetime
    sentiment_analysis: Optional[SentimentResponse] = None
    topics: List[TopicResponse] = []

    model_config = ConfigDict(from_attributes=True)


class FeedbackCreateResponse(BaseModel):
    id: str
    analysis_status: str
    created_at: datetime
    feedback_text: Optional[str] = None
    rating: Optional[int] = None
    customer_email: Optional[str] = None
    sentiment_analysis: Optional[SentimentResponse] = None
    topics: List[TopicResponse] = []

    model_config = ConfigDict(from_attributes=True)


class SentimentDistribution(BaseModel):
    positive: int = 0
    neutral: int = 0
    negative: int = 0
    positive_percentage: float = 0.0
    neutral_percentage: float = 0.0
    negative_percentage: float = 0.0


class TopTopicItem(BaseModel):
    name: str
    count: int
    percentage: float
    sentiment: str


class AdminInsightsResponse(BaseModel):
    total_feedback: int
    avg_rating: float
    sentiment_distribution: SentimentDistribution
    top_topics: List[TopTopicItem]


class AdminFeedbackListResponse(BaseModel):
    items: List[FeedbackResponse]
    total: int
    skip: int
    limit: int
