from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


# ---------------------------------------------------------
# POSE SCHEMAS
# ---------------------------------------------------------
class PoseBase(BaseModel):
    english_name: str = Field(..., min_length=1, description="English name of the pose")
    sanskrit_name: Optional[str] = Field(None, description="Sanskrit name of the pose")
    difficulty: str = Field(
        ..., description="Difficulty level: Beginner, Intermediate, Advanced"
    )
    category: str = Field(
        ..., description="Category: Standing, Seated, Inversion, Balance, Restorative"
    )
    alignment_cues: Optional[str] = None
    breath_instructions: Optional[str] = None
    target_muscles: Optional[str] = None
    common_mistakes: Optional[str] = None
    image_url: Optional[str] = None
    video_url: Optional[str] = None


class PoseCreate(PoseBase):
    pass


class PoseUpdate(BaseModel):
    english_name: Optional[str] = None
    sanskrit_name: Optional[str] = None
    difficulty: Optional[str] = None
    category: Optional[str] = None
    alignment_cues: Optional[str] = None
    breath_instructions: Optional[str] = None
    target_muscles: Optional[str] = None
    common_mistakes: Optional[str] = None
    image_url: Optional[str] = None
    video_url: Optional[str] = None


class PoseResponse(PoseBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    is_favorite: Optional[bool] = False
    created_at: datetime
    updated_at: datetime


# ---------------------------------------------------------
# ROUTINE POSE ITEM SCHEMAS
# ---------------------------------------------------------
class RoutinePoseItemCreate(BaseModel):
    pose_id: str = Field(..., description="UUID of the target pose")
    sequence_order: Optional[int] = Field(
        1, ge=1, description="Position order in sequence"
    )
    hold_duration_seconds: int = Field(30, ge=1, description="Hold duration in seconds")
    transition_notes: Optional[str] = None


class RoutinePoseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    routine_id: str
    pose_id: str
    sequence_order: int
    hold_duration_seconds: int
    transition_notes: Optional[str] = None
    pose: Optional[PoseResponse] = None
    created_at: datetime
    updated_at: datetime


# ---------------------------------------------------------
# ROUTINE SCHEMAS
# ---------------------------------------------------------
class RoutineCreate(BaseModel):
    name: str = Field(..., min_length=1, description="Routine title")
    description: Optional[str] = None
    poses: Optional[List[RoutinePoseItemCreate]] = Field(default_factory=list)
    items: Optional[List[RoutinePoseItemCreate]] = (
        None  # Alias support for frontend flexibility
    )


class RoutineUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    poses: Optional[List[RoutinePoseItemCreate]] = None
    items: Optional[List[RoutinePoseItemCreate]] = None


class RoutineResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    description: Optional[str] = None
    total_duration_seconds: int
    poses: List[RoutinePoseResponse] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime


# ---------------------------------------------------------
# FAVORITES SCHEMAS
# ---------------------------------------------------------
class FavoriteActionResponse(BaseModel):
    message: str
    pose_id: str


# ---------------------------------------------------------
# PRACTICE SESSION SCHEMAS
# ---------------------------------------------------------
class PracticeSessionCreate(BaseModel):
    routine_id: Optional[str] = None
    completed_duration_seconds: int = Field(
        ..., ge=0, description="Total duration in seconds"
    )
    poses_completed: int = Field(..., ge=0, description="Count of poses completed")
    notes: Optional[str] = None
    user_id: Optional[str] = "default_user"


class PracticeSessionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: str
    routine_id: Optional[str] = None
    completed_duration_seconds: int
    poses_completed: int
    notes: Optional[str] = None
    completed_at: datetime
    routine_name: Optional[str] = None
