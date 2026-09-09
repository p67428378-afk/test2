from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, EmailStr, Field


# ---------------------------------------------------------------------------
# Auth / User Schemas
# ---------------------------------------------------------------------------
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None


class UserRegister(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(UserBase):
    id: str
    role: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Optional[UserOut] = None


class TokenData(BaseModel):
    user_id: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None


# ---------------------------------------------------------------------------
# Species Schemas
# ---------------------------------------------------------------------------
class SpeciesBase(BaseModel):
    common_name: str
    scientific_name: Optional[str] = None
    sunlight_requirement: Optional[str] = "Bright Indirect Light"
    light_requirement: Optional[str] = None
    humidity_requirement: Optional[str] = "Medium to High (50-60%)"
    humidity_target_pct: Optional[int] = 50
    temp_min_f: Optional[int] = 65
    temp_max_f: Optional[int] = 80
    recommended_watering_days: Optional[int] = 7
    default_watering_interval_days: Optional[int] = 7
    default_fertilization_interval_days: Optional[int] = 30
    description: Optional[str] = None


class SpeciesCreate(SpeciesBase):
    pass


class SpeciesUpdate(BaseModel):
    common_name: Optional[str] = None
    scientific_name: Optional[str] = None
    sunlight_requirement: Optional[str] = None
    light_requirement: Optional[str] = None
    humidity_requirement: Optional[str] = None
    humidity_target_pct: Optional[int] = None
    temp_min_f: Optional[int] = None
    temp_max_f: Optional[int] = None
    recommended_watering_days: Optional[int] = None
    default_watering_interval_days: Optional[int] = None
    default_fertilization_interval_days: Optional[int] = None
    description: Optional[str] = None


class SpeciesOut(SpeciesBase):
    id: str
    is_custom: bool
    created_by_user_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ---------------------------------------------------------------------------
# Care Log Schemas
# ---------------------------------------------------------------------------
class CareLogOut(BaseModel):
    id: str
    plant_id: str
    care_type: str
    performed_at: datetime
    notes: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ---------------------------------------------------------------------------
# Plant Health Log Schemas
# ---------------------------------------------------------------------------
class PlantHealthLogCreate(BaseModel):
    plant_id: str
    rating: str  # Excellent, Good, Fair, Poor
    notes: Optional[str] = None
    repotted_flag: Optional[bool] = False
    photo_url: Optional[str] = None
    logged_at: Optional[datetime] = None


class PlantHealthLogOut(BaseModel):
    id: str
    plant_id: str
    user_id: str
    rating: str
    notes: Optional[str] = None
    repotted_flag: bool
    photo_url: Optional[str] = None
    logged_at: datetime
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ---------------------------------------------------------------------------
# User Plant Schemas
# ---------------------------------------------------------------------------
class UserPlantBase(BaseModel):
    nickname: str
    species_id: Optional[str] = None
    location: Optional[str] = "Living Room"
    photo_url: Optional[str] = None
    status: Optional[str] = "Active"
    watering_interval_days: Optional[int] = 7
    fertilization_interval_days: Optional[int] = 30
    notifications_enabled: Optional[bool] = True


class UserPlantCreate(UserPlantBase):
    pass


class UserPlantUpdate(BaseModel):
    nickname: Optional[str] = None
    species_id: Optional[str] = None
    location: Optional[str] = None
    photo_url: Optional[str] = None
    status: Optional[str] = None
    watering_interval_days: Optional[int] = None
    fertilization_interval_days: Optional[int] = None
    notifications_enabled: Optional[bool] = None
    last_watered_at: Optional[datetime] = None
    next_water_due: Optional[datetime] = None
    snoozed_until: Optional[datetime] = None


class UserPlantOut(UserPlantBase):
    id: str
    user_id: str
    last_watered_at: Optional[datetime] = None
    next_water_due: Optional[datetime] = None
    last_fertilized_at: Optional[datetime] = None
    next_fertilize_due: Optional[datetime] = None
    snoozed_until: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    # Convenience aliases for frontend compatibility
    last_watered: Optional[datetime] = None
    next_due_date: Optional[datetime] = None
    species_name: Optional[str] = None
    species: Optional[SpeciesOut] = None

    model_config = ConfigDict(from_attributes=True)


class WaterPlantRequest(BaseModel):
    watered_at: Optional[datetime] = None
    notes: Optional[str] = None


class FertilizePlantRequest(BaseModel):
    fertilized_at: Optional[datetime] = None
    notes: Optional[str] = None


class SnoozePlantRequest(BaseModel):
    snooze_hours: Optional[int] = 24


# ---------------------------------------------------------------------------
# Schedule / Dashboard Schemas
# ---------------------------------------------------------------------------
class SummaryStats(BaseModel):
    overdue_count: int = 0
    due_today_count: int = 0
    total_plants: int = 0
    healthy_count: int = 0
    care_score: int = 100


class DashboardSchedulesOut(BaseModel):
    overdue: List[UserPlantOut] = Field(default_factory=list)
    due_today: List[UserPlantOut] = Field(default_factory=list)
    upcoming: List[UserPlantOut] = Field(default_factory=list)
    summary_stats: SummaryStats


class NotificationItem(BaseModel):
    plant_id: str
    nickname: str
    care_type: str
    due_date: Optional[datetime] = None
    is_overdue: bool
    location: Optional[str] = None


class NotificationSummaryOut(BaseModel):
    total_alerts: int
    overdue_count: int
    due_today_count: int
    alerts: List[NotificationItem]


class SendNotificationResponse(BaseModel):
    status: str = "sent"
    message: str
    total_alerts: int
    recipients: List[str]
