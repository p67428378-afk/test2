from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field, field_validator


class SiteBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=150)
    site_code: str = Field(..., min_length=1, max_length=50)
    region: str = Field(..., min_length=1, max_length=100)
    historical_period: str = Field(..., min_length=1, max_length=100)
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    altitude_meters: Optional[float] = None
    description: Optional[str] = None


class SiteCreate(SiteBase):
    pass


class SiteUpdate(BaseModel):
    name: Optional[str] = None
    site_code: Optional[str] = None
    region: Optional[str] = None
    historical_period: Optional[str] = None
    latitude: Optional[float] = Field(None, ge=-90.0, le=90.0)
    longitude: Optional[float] = Field(None, ge=-180.0, le=180.0)
    altitude_meters: Optional[float] = None
    description: Optional[str] = None


class SiteResponse(SiteBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
