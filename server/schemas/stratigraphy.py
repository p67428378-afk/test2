from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field


class StratigraphicLayerBase(BaseModel):
    layer_code: str = Field(..., min_length=1, max_length=50)
    historical_period: str = Field(..., min_length=1, max_length=100)
    depth_top_meters: float
    depth_bottom_meters: float
    color_hex: str = Field(default="#8B4513", max_length=7)


class StratigraphicLayerCreate(StratigraphicLayerBase):
    pass


class StratigraphicLayerResponse(StratigraphicLayerBase):
    id: str
    site_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SpatialArtifactNode(BaseModel):
    id: str
    artifact_code: str
    material: str
    x_offset_meters: float
    y_offset_meters: float
    z_depth_meters: float
    context_layer: Optional[str] = None
    interpolated_depth: bool = False

    class Config:
        from_attributes = True


class TrenchBounds(BaseModel):
    min_x: float
    max_x: float
    min_y: float
    max_y: float
    min_depth: float
    max_depth: float


class TrenchStratigraphyResponse(BaseModel):
    site_id: str
    site_name: str
    bounds: TrenchBounds
    layers: List[StratigraphicLayerResponse]
    artifacts: List[SpatialArtifactNode]
