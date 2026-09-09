from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field, ConfigDict


# ---------------- User Schemas ----------------
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: str
    is_active: bool
    role: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenData(BaseModel):
    user_id: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None


# ---------------- Species Schemas ----------------
class SpeciesBase(BaseModel):
    common_name: str
    scientific_name: Optional[str] = None
    sunlight_requirement: str
    humidity_requirement: str
    recommended_watering_days: int = Field(default=7, ge=1)
    description: Optional[str] = None


class SpeciesCreate(SpeciesBase):
    pass


class SpeciesUpdate(BaseModel):
    common_name: Optional[str] = None
    scientific_name: Optional[str] = None
    sunlight_requirement: Optional[str] = None
    humidity_requirement: Optional[str] = None
    recommended_watering_days: Optional[int] = Field(None, ge=1)
    description: Optional[str] = None


class SpeciesResponse(SpeciesBase):
    id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ---------------- Watering Log Schemas ----------------
class WateringLogBase(BaseModel):
    watered_at: Optional[datetime] = None
    notes: Optional[str] = None


class WateringLogCreate(WateringLogBase):
    pass


class WateringLogResponse(BaseModel):
    id: str
    plant_id: str
    watered_at: datetime
    notes: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ---------------- User Plant Schemas ----------------
class UserPlantBase(BaseModel):
    nickname: str
    species_id: Optional[str] = None
    location: Optional[str] = None
    photo_url: Optional[str] = None
    watering_interval_days: int = Field(default=7, ge=1)
    notifications_enabled: bool = True


class UserPlantCreate(BaseModel):
    nickname: str
    species_id: Optional[str] = None
    location: Optional[str] = None
    photo_url: Optional[str] = None
    watering_interval_days: Optional[int] = Field(default=None, ge=1)
    notifications_enabled: bool = True
    last_watered: Optional[datetime] = None


class UserPlantUpdate(BaseModel):
    nickname: Optional[str] = None
    species_id: Optional[str] = None
    location: Optional[str] = None
    photo_url: Optional[str] = None
    watering_interval_days: Optional[int] = Field(None, ge=1)
    notifications_enabled: Optional[bool] = None


class UserPlantResponse(UserPlantBase):
    id: str
    user_id: str
    last_watered: Optional[datetime] = None
    next_due_date: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    species: Optional[SpeciesResponse] = None

    model_config = ConfigDict(from_attributes=True)


class UserPlantDetailResponse(UserPlantResponse):
    watering_logs: List[WateringLogResponse] = []

    model_config = ConfigDict(from_attributes=True)


class WaterPlantRequest(BaseModel):
    watered_at: Optional[datetime] = None
    notes: Optional[str] = None


# ---------------- Dashboard & Schedule Schemas ----------------
class DashboardScheduleStats(BaseModel):
    total_plants: int
    overdue_count: int
    due_today_count: int
    healthy_count: int
    care_score: int


class DashboardScheduleResponse(BaseModel):
    due_today: List[UserPlantResponse]
    overdue: List[UserPlantResponse]
    upcoming: List[UserPlantResponse]
    summary_stats: DashboardScheduleStats


class PlantNotificationItem(BaseModel):
    plant_id: str
    nickname: str
    location: Optional[str] = None
    status: str  # "overdue" or "due_today"
    next_due_date: Optional[datetime] = None
    message: str


class NotificationSummaryResponse(BaseModel):
    notifications: List[PlantNotificationItem]
    total_alerts: int
    sent_to_email: Optional[str] = None
    timestamp: datetime
