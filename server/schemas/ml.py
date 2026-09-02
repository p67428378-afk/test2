from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field


class MLAnomalyItem(BaseModel):
    type: str
    severity: str  # low, medium, high, critical
    description: str


class MLClassificationRequest(BaseModel):
    artifact_id: str
    media_id: Optional[str] = None
    image_base64: Optional[str] = None


class MLClassificationResponse(BaseModel):
    id: str
    artifact_id: str
    media_id: Optional[str] = None
    predicted_material: str
    confidence_score: float
    anomalies_detected: List[MLAnomalyItem] = []
    requires_manual_override: bool
    created_at: datetime

    class Config:
        from_attributes = True
