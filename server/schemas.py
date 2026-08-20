from pydantic import BaseModel
from typing import Optional
from uuid import UUID


class UserLogin(BaseModel):
    username: str
    password: str


class UserResponse(BaseModel):
    id: UUID
    username: str
    role: str

    class Config:
        from_attributes = True


class TokenUser(BaseModel):
    id: UUID
    username: str
    role: str


class Token(BaseModel):
    access_token: str
    token_type: str
    user: TokenUser


class HabitResponse(BaseModel):
    id: UUID
    name: str
    description: Optional[str] = None
    icon: str
    points: int
    is_completed_today: bool

    class Config:
        from_attributes = True


class HabitCompleteResponse(BaseModel):
    message: str
    points_earned: int
    new_total_stars: int
    current_streak: int


class ChildProgressSummary(BaseModel):
    child_id: UUID
    username: str
    total_stars: int
    current_streak: int
    completed_today_count: int
    total_active_habits: int


class HabitToggleRequest(BaseModel):
    is_active: bool


class HabitToggleResponse(BaseModel):
    id: UUID
    name: str
    is_active: bool

    class Config:
        from_attributes = True


class ProgressResetResponse(BaseModel):
    message: str
    child_id: UUID
    total_stars: int
    current_streak: int
