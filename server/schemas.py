from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field
from uuid import UUID


# User / Auth Schemas
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    role: Optional[str] = "child"


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: UUID
    role: str
    is_parent_verified: bool


class TokenData(BaseModel):
    user_id: Optional[str] = None


class UserResponse(UserBase):
    id: UUID
    is_parent_verified: bool
    is_active: bool
    is_verified: bool
    total_points: int
    parent_id: Optional[UUID] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ParentalConsentRequest(BaseModel):
    token: Optional[str] = None
    consent_granted: bool = True
    parent_email: Optional[EmailStr] = None


class ParentalConsentResponse(BaseModel):
    message: str
    status: str
    is_parent_verified: bool


# Habit Schemas
class HabitBase(BaseModel):
    category: str
    title: str
    description: Optional[str] = None
    points_value: int = 10


class HabitCreate(HabitBase):
    pass


class HabitResponse(HabitBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True


class HabitLogCreate(BaseModel):
    habit_id: UUID
    completed_at: Optional[datetime] = None
    local_date: Optional[date] = None


class HabitLogResponse(BaseModel):
    log_id: UUID
    habit_id: UUID
    user_id: UUID
    points_awarded: int
    total_points: int
    current_streak: int
    longest_streak: int
    unlocked_badges: List[str] = []
    message: str = "Habit logged successfully!"


# Streak Schemas
class StreakResponse(BaseModel):
    id: UUID
    user_id: UUID
    current_streak: int
    longest_streak: int
    last_logged_date: Optional[date] = None

    class Config:
        from_attributes = True


# Badge Schemas
class BadgeResponse(BaseModel):
    id: UUID
    name: str
    description: Optional[str] = None
    required_points: int
    icon_key: str

    class Config:
        from_attributes = True


class UserBadgeResponse(BaseModel):
    badge_id: UUID
    name: str
    description: Optional[str] = None
    icon_key: str
    awarded_at: datetime

    class Config:
        from_attributes = True


class UserStreakDetailResponse(BaseModel):
    user_id: UUID
    current_streak: int
    longest_streak: int
    last_logged_date: Optional[date] = None
    total_points: int
    is_parent_verified: bool
    badges: List[UserBadgeResponse] = []


# Lesson & Quiz Schemas
class LessonResponse(BaseModel):
    id: UUID
    title: str
    category: str
    content: Optional[str] = None
    quiz_question: Optional[str] = None
    quiz_options: Optional[str] = None
    points_value: int

    class Config:
        from_attributes = True


class QuizSubmitRequest(BaseModel):
    answer: str


class QuizSubmitResponse(BaseModel):
    correct: bool
    message: str
    points_awarded: int
    total_points: int
