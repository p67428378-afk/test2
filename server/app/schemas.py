from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional


class UserCreate(BaseModel):
    username: str


class UserResponse(BaseModel):
    id: str
    username: str
    created_at: datetime

    class Config:
        orm_mode = True
        from_attributes = True


class ActivityResponse(BaseModel):
    id: str
    module: str
    name: str
    points: int
    description: Optional[str] = None

    class Config:
        orm_mode = True
        from_attributes = True


class ProgressCreate(BaseModel):
    user_id: str
    activity_id: str
    completed: bool
    score: Optional[float] = None


class ProgressResponse(BaseModel):
    id: str
    user_id: str
    activity_id: str
    completed_at: datetime
    points_earned: int
    badge_awarded: Optional[str] = None

    class Config:
        orm_mode = True
        from_attributes = True


class CompletedActivityInfo(BaseModel):
    activity_id: str
    completed_at: datetime
    module: str
    name: str

    class Config:
        orm_mode = True
        from_attributes = True


class UnlockedBadgeInfo(BaseModel):
    badge_name: str
    awarded_at: datetime

    class Config:
        orm_mode = True
        from_attributes = True


class UserProgressSummaryResponse(BaseModel):
    user_id: str
    username: str
    total_points: int
    completed_activities: List[CompletedActivityInfo]
    unlocked_badges: List[UnlockedBadgeInfo]

    class Config:
        orm_mode = True
        from_attributes = True
