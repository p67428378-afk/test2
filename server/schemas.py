import uuid
from datetime import datetime
from typing import List, Optional, Any
from pydantic import BaseModel, EmailStr, Field, ConfigDict, field_validator


# -------------------------
# User & Auth Schemas
# -------------------------
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=6, description="Password at least 6 chars")
    role: Optional[str] = "student"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(UserBase):
    id: str
    role: str
    is_active: bool
    is_verified: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class TokenData(BaseModel):
    user_id: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None


# -------------------------
# Hotspot & Layer Schemas
# -------------------------
class HotspotBase(BaseModel):
    x_percent: float = Field(
        ..., ge=0.0, le=100.0, description="X coordinate percentage 0-100"
    )
    y_percent: float = Field(
        ..., ge=0.0, le=100.0, description="Y coordinate percentage 0-100"
    )
    title: str
    clinical_notes: Optional[str] = None
    clinical_significance: Optional[str] = None


class HotspotCreate(HotspotBase):
    layer_id: str


class HotspotResponse(HotspotBase):
    id: str
    layer_id: str
    # Alias / compatibility fields for client viewers
    x_coord: Optional[float] = None
    y_coord: Optional[float] = None
    notes: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

    @field_validator("x_coord", mode="before")
    @classmethod
    def set_x_coord(cls, v: Any, info: Any) -> Any:
        return v

    @field_validator("y_coord", mode="before")
    @classmethod
    def set_y_coord(cls, v: Any, info: Any) -> Any:
        return v


class ImageLayerBase(BaseModel):
    layer_name: str
    layer_order: int = 0
    image_url: str


class ImageLayerCreate(ImageLayerBase):
    module_id: str


class ImageLayerResponse(ImageLayerBase):
    id: str
    module_id: str
    name: Optional[str] = None
    order: Optional[int] = None
    layer_url: Optional[str] = None
    hotspots: List[HotspotResponse] = []

    model_config = ConfigDict(from_attributes=True)


class AnnotationBundleResponse(BaseModel):
    module_id: str
    image_url: Optional[str] = None
    layers: List[ImageLayerResponse] = []
    hotspots: List[HotspotResponse] = []

    model_config = ConfigDict(from_attributes=True)


# -------------------------
# Checkpoint & Quiz Schemas
# -------------------------
class AnimationCheckpointBase(BaseModel):
    timestamp_seconds: float = Field(..., ge=0.0)
    question_text: str
    options: List[str]
    correct_option: int = Field(..., ge=0)


class AnimationCheckpointCreate(AnimationCheckpointBase):
    module_id: str


class AnimationCheckpointResponse(AnimationCheckpointBase):
    id: str
    module_id: str
    # Compatibility aliases
    checkpoint_time_seconds: Optional[float] = None
    question_id: Optional[str] = None
    correct_option_index: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)


class QuizEvaluateRequest(BaseModel):
    checkpoint_id: str
    selected_option: int


class QuizEvaluateResponse(BaseModel):
    is_correct: bool
    correct_option: int
    explanation: Optional[str] = None


# -------------------------
# Module Schemas
# -------------------------
class ModuleBase(BaseModel):
    title: str
    subject: str  # 'anatomy', 'physiology', 'biochemistry'
    description: Optional[str] = None
    thumbnail_url: Optional[str] = None
    animation_url: Optional[str] = None


class ModuleCreate(ModuleBase):
    pass


class ModuleResponse(ModuleBase):
    id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ModuleDetailResponse(ModuleResponse):
    image_layers: List[ImageLayerResponse] = []
    checkpoints: List[AnimationCheckpointResponse] = []

    model_config = ConfigDict(from_attributes=True)


# -------------------------
# Progress Schemas
# -------------------------
class ProgressCreateRequest(BaseModel):
    module_id: str
    user_id: Optional[str] = None
    score: int = Field(..., ge=0, le=100)
    completed_checkpoints: Optional[List[str]] = Field(default_factory=list)
    completed_at: Optional[datetime] = None

    @field_validator("module_id")
    @classmethod
    def validate_module_uuid(cls, v: str) -> str:
        try:
            uuid.UUID(str(v))
        except (ValueError, TypeError, AttributeError):
            raise ValueError("module_id must be a valid UUID string")
        return str(v)

    @field_validator("user_id")
    @classmethod
    def validate_user_uuid(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            try:
                uuid.UUID(str(v))
            except (ValueError, TypeError, AttributeError):
                raise ValueError("user_id must be a valid UUID string")
            return str(v)
        return v


class ProgressResponse(BaseModel):
    id: str
    status: str = "recorded"
    progress_id: Optional[str] = None
    module_id: str
    user_id: Optional[str] = None
    score: int
    updated_total_score: Optional[int] = None
    completed_checkpoints: List[str] = []
    is_completed: bool
    completed_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProgressSummaryResponse(BaseModel):
    enrolled_modules: int
    completed_modules: int
    average_score: float
    completed_checkpoints: int
    recent_progress: List[ProgressResponse] = []
