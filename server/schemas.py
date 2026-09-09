from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


# --- Pose Schemas ---
class PoseBase(BaseModel):
    english_name: str = Field(
        ..., min_length=1, max_length=255, description="English common name of the pose"
    )
    sanskrit_name: str = Field(
        ..., min_length=1, max_length=255, description="Traditional Sanskrit name"
    )
    difficulty: str = Field(
        ..., description="Difficulty level: Beginner, Intermediate, Advanced"
    )
    category: str = Field(
        ..., description="Category: Standing, Seated, Inversion, Balance, Restorative"
    )
    alignment_cues: List[str] = Field(
        default_factory=list, description="Step-by-step alignment cues"
    )
    breath_instructions: Optional[str] = Field(
        None, description="Breath coordination instructions"
    )
    target_muscles: Optional[List[str]] = Field(
        default_factory=list, description="Targeted muscle groups"
    )
    common_mistakes: Optional[List[str]] = Field(
        default_factory=list, description="Common alignment mistakes"
    )
    image_url: Optional[str] = Field(None, description="Image URL or CDN asset link")
    video_url: Optional[str] = Field(None, description="Video tutorial or stream URL")


class PoseCreate(PoseBase):
    pass


class PoseUpdate(BaseModel):
    english_name: Optional[str] = None
    sanskrit_name: Optional[str] = None
    difficulty: Optional[str] = None
    category: Optional[str] = None
    alignment_cues: Optional[List[str]] = None
    breath_instructions: Optional[str] = None
    target_muscles: Optional[List[str]] = None
    common_mistakes: Optional[List[str]] = None
    image_url: Optional[str] = None
    video_url: Optional[str] = None


class PoseResponse(PoseBase):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class PoseSummary(BaseModel):
    id: str
    english_name: str
    sanskrit_name: str
    difficulty: str
    category: str
    image_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


# --- Routine Pose Item Schemas ---
class RoutinePoseItemCreate(BaseModel):
    pose_id: str = Field(..., description="UUID of the yoga pose")
    sequence_order: int = Field(..., ge=1, description="Ordinal sequence position")
    hold_duration_seconds: int = Field(30, ge=1, description="Hold duration in seconds")
    transition_notes: Optional[str] = Field(
        None, description="Transition notes to next pose"
    )


class RoutinePoseItemResponse(BaseModel):
    id: str
    pose_id: str
    sequence_order: int
    hold_duration_seconds: int
    transition_notes: Optional[str] = None
    pose: Optional[PoseSummary] = None

    model_config = ConfigDict(from_attributes=True)


# --- Routine Schemas ---
class RoutineBase(BaseModel):
    name: str = Field(
        ..., min_length=1, max_length=255, description="Name of the custom routine"
    )
    description: Optional[str] = Field(None, description="Description of the routine")


class RoutineCreate(RoutineBase):
    items: List[RoutinePoseItemCreate] = Field(
        ..., min_length=1, description="Ordered pose sequence"
    )


class RoutineUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    items: Optional[List[RoutinePoseItemCreate]] = None


class RoutineResponse(RoutineBase):
    id: str
    total_duration_seconds: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    items: List[RoutinePoseItemResponse] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)
