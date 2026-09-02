from typing import Optional, Any
from datetime import datetime
from pydantic import BaseModel, Field


class LabAnalysisBase(BaseModel):
    artifact_id: str
    test_type: str = Field(..., min_length=1, max_length=100)
    lab_name: str = Field(..., min_length=1, max_length=150)
    status: str = Field(default="Pending", max_length=50)
    results: Optional[Any] = None
    notes: Optional[str] = None


class LabAnalysisCreate(LabAnalysisBase):
    pass


class LabAnalysisUpdate(BaseModel):
    test_type: Optional[str] = None
    lab_name: Optional[str] = None
    status: Optional[str] = None
    results: Optional[Any] = None
    notes: Optional[str] = None


class LabAnalysisResponse(LabAnalysisBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
