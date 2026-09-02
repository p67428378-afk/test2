from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field


class ArtifactBase(BaseModel):
    artifact_code: str = Field(..., min_length=1, max_length=100)
    site_id: str
    material: str = Field(..., min_length=1, max_length=100)
    context_layer: Optional[str] = None
    depth_meters: Optional[float] = None
    excavation_date: Optional[str] = None
    finder_member_id: Optional[str] = None
    description: Optional[str] = None
    x_offset_meters: Optional[float] = None
    y_offset_meters: Optional[float] = None
    z_depth_meters: Optional[float] = None
    qr_code_identifier: Optional[str] = None


class ArtifactCreate(ArtifactBase):
    pass


class ArtifactUpdate(BaseModel):
    artifact_code: Optional[str] = None
    site_id: Optional[str] = None
    material: Optional[str] = None
    context_layer: Optional[str] = None
    depth_meters: Optional[float] = None
    excavation_date: Optional[str] = None
    finder_member_id: Optional[str] = None
    description: Optional[str] = None
    x_offset_meters: Optional[float] = None
    y_offset_meters: Optional[float] = None
    z_depth_meters: Optional[float] = None
    qr_code_identifier: Optional[str] = None


class ArtifactResponse(ArtifactBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
