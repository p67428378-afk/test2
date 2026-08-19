from datetime import datetime
from typing import Optional, List, Dict
from pydantic import BaseModel, ConfigDict, Field, field_validator


class MaintenanceEventBase(BaseModel):
    title: str = Field(
        ..., max_length=255, description="Title of the maintenance event"
    )
    event_date: datetime = Field(..., description="Timestamp of the maintenance event")
    location: str = Field(
        ..., max_length=255, description="Location or Access Point ID"
    )
    maintenance_type: str = Field(
        ..., max_length=100, description="Category of maintenance"
    )
    vendor_technician: str = Field(
        ..., max_length=255, description="Vendor or technician name"
    )
    cost: float = Field(..., ge=0.0, description="Cost of maintenance ($)")
    description: Optional[str] = Field(None, description="Detailed notes or remarks")

    @field_validator("cost")
    @classmethod
    def validate_cost_non_negative(cls, v: float) -> float:
        if v < 0.0:
            raise ValueError("Cost cannot be negative ($0.00 or greater required)")
        return v


class MaintenanceEventCreate(MaintenanceEventBase):
    pass


class MaintenanceEventUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=255)
    event_date: Optional[datetime] = None
    location: Optional[str] = Field(None, max_length=255)
    maintenance_type: Optional[str] = Field(None, max_length=100)
    vendor_technician: Optional[str] = Field(None, max_length=255)
    cost: Optional[float] = Field(None, ge=0.0)
    description: Optional[str] = None

    @field_validator("cost")
    @classmethod
    def validate_cost_non_negative(cls, v: Optional[float]) -> Optional[float]:
        if v is not None and v < 0.0:
            raise ValueError("Cost cannot be negative ($0.00 or greater required)")
        return v


class MaintenanceEventResponse(MaintenanceEventBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class MaintenanceEventListResponse(BaseModel):
    items: List[MaintenanceEventResponse]
    total: int
    skip: int
    limit: int


class MonthlyTrend(BaseModel):
    month: str
    total_cost: float
    event_count: int


class CostSummaryResponse(BaseModel):
    total_spend: float
    total_events: int
    cost_by_type: Dict[str, float]
    cost_by_location: Dict[str, float]
    monthly_trends: List[MonthlyTrend]
