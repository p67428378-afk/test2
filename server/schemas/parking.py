from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict


class SpotOverviewItem(BaseModel):
    spot_id: str
    location_id: Optional[str] = None
    name: str
    address: str
    latitude: float
    longitude: float
    distance_km: float = 0.0
    hourly_rate: float
    currency: str = "USD"
    status: str = "AVAILABLE"
    total_capacity: int
    available_spots: int
    spot_type: str
    has_ev_charging: bool
    is_peak_hours: bool = False
    updated_at: str

    model_config = ConfigDict(from_attributes=True)


class ParkingSearchResponse(BaseModel):
    total: int
    spots: List[SpotOverviewItem]


class RateBreakdown(BaseModel):
    standard_rate: str
    peak_rate: str
    weekend_rate: str


class HourlyRateDetailResponse(BaseModel):
    spot_id: str
    base_hourly_rate: float
    currency: str = "USD"
    rate_breakdown: RateBreakdown
    current_active_rate: float
    is_peak: bool
    max_daily_cap: float

    model_config = ConfigDict(from_attributes=True)


class ParkingSpotItem(BaseModel):
    id: str
    location_id: str
    spot_number: str
    status: str
    last_status_change: datetime

    model_config = ConfigDict(from_attributes=True)


class ParkingLocationDetailResponse(BaseModel):
    id: str
    name: str
    address: str
    latitude: float
    longitude: float
    spot_type: str
    has_ev_charging: bool
    total_capacity: int
    available_spots: int
    base_hourly_rate: float
    current_active_rate: float
    is_peak: bool
    rates: Optional[HourlyRateDetailResponse] = None
    individual_spots: List[ParkingSpotItem] = []
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ParkingLocationCreate(BaseModel):
    name: str = Field(..., min_length=1)
    address: str = Field(..., min_length=1)
    latitude: float
    longitude: float
    spot_type: str = "garage"
    has_ev_charging: bool = False
    total_capacity: int = Field(50, gt=0)
    available_spots: Optional[int] = None
    base_hourly_rate: float = Field(5.0, ge=0)
    peak_rate_per_hour: Optional[float] = None
    weekend_rate_per_hour: Optional[float] = None
    max_daily_rate: Optional[float] = None


class ParkingSpotStatusUpdate(BaseModel):
    status: Optional[str] = Field(None, description="AVAILABLE, OCCUPIED, or RESERVED")
    available_spots: Optional[int] = Field(
        None, ge=0, description="Updated count of open spots"
    )


class CostEstimateRequest(BaseModel):
    hours: float = Field(..., gt=0, description="Number of hours to park")
    start_time: Optional[str] = Field(
        None, description="ISO timestamp or HH:MM:SS for arrival time"
    )


class CostEstimateResponse(BaseModel):
    spot_id: str
    name: str
    requested_hours: float
    estimated_cost: float
    currency: str = "USD"
    capped_at_daily_max: bool
    applied_rate_per_hour: float
    is_peak: bool


class RealtimeStatusEvent(BaseModel):
    event: str = "SPOT_STATUS_CHANGED"
    spot_id: str
    status: str
    available_spots: int
    timestamp: str
