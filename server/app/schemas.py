from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional


# User schemas
class UserCreate(BaseModel):
    username: str = Field(..., min_length=1, max_length=255)


class UserResponse(BaseModel):
    id: str
    username: str
    created_at: datetime

    class Config:
        from_attributes = True


# Activity schemas
class ActivityResponse(BaseModel):
    id: str
    module: str
    name: str
    points: int
    description: Optional[str] = None

    class Config:
        from_attributes = True


# Progress schemas
class ProgressCreate(BaseModel):
    activity_id: str
    completed: bool
    score: float
    user_id: str


class ProgressResponse(BaseModel):
    id: str
    user_id: str
    activity_id: str
    points_earned: int
    badge_awarded: Optional[str] = None
    completed_at: datetime

    class Config:
        from_attributes = True


# User Progress Summary schemas
class CompletedActivityInfo(BaseModel):
    activity_id: str
    completed_at: datetime
    module: str
    name: str


class UnlockedBadgeInfo(BaseModel):
    badge_name: str
    awarded_at: datetime


class UserProgressSummaryResponse(BaseModel):
    user_id: str
    username: str
    total_points: int
    completed_activities: List[CompletedActivityInfo]
    unlocked_badges: List[UnlockedBadgeInfo]

    class Config:
        from_attributes = True
