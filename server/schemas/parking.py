from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict, Field


class HourlyRateSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    location_id: str
    base_rate_per_hour: float
    peak_rate_per_hour: float
    weekend_rate_per_hour: Optional[float] = None
    peak_start_time: Optional[str] = "07:00:00"
    peak_end_time: Optional[str] = "19:00:00"
    max_daily_rate: Optional[float] = None
    currency: str = "USD"


class RateBreakdownResponse(BaseModel):
    spot_id: str
    base_hourly_rate: float
    currency: str = "USD"
    rate_breakdown: Dict[str, str]
    current_active_rate: float
    is_peak: bool
    max_daily_cap: Optional[float] = None


class ParkingSpotSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    location_id: str
    spot_number: str
    status: str
    last_status_change: datetime


class ParkingLocationCreate(BaseModel):
    name: str
    address: str
    latitude: float
    longitude: float
    spot_type: str = "garage"
    has_ev_charging: bool = False
    total_capacity: int = 10
    base_rate_per_hour: float = 5.0
    peak_rate_per_hour: float = 8.0
    weekend_rate_per_hour: Optional[float] = 6.0
    max_daily_rate: Optional[float] = 35.0


class SpotSearchItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    spot_id: str
    id: Optional[str] = None
    name: str
    address: str
    latitude: float
    longitude: float
    distance_km: float
    hourly_rate: float
    base_hourly_rate: Optional[float] = None
    current_active_rate: Optional[float] = None
    currency: str = "USD"
    status: str
    total_capacity: int
    available_spots: int
    spot_type: str
    has_ev_charging: bool
    is_peak_hours: bool
    is_peak: Optional[bool] = None
    updated_at: datetime


class SpotSearchResponse(BaseModel):
    total: int
    spots: List[SpotSearchItem]


class ParkingLocationDetail(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    spot_id: str
    name: str
    address: str
    latitude: float
    longitude: float
    spot_type: str
    has_ev_charging: bool
    total_capacity: int
    available_spots: int
    status: str
    hourly_rate: float
    base_hourly_rate: float
    current_active_rate: float
    is_peak: bool
    is_peak_hours: bool
    currency: str = "USD"
    rates: Optional[RateBreakdownResponse] = None
    spots: Optional[List[ParkingSpotSchema]] = None
    created_at: datetime
    updated_at: datetime


class SpotStatusUpdate(BaseModel):
    status: Optional[str] = None
    available_spots: Optional[int] = None
    spot_number: Optional[str] = None


class SpotStatusResponse(BaseModel):
    spot_id: str
    status: str
    available_spots: int
    updated_at: datetime


class CalculateCostRequest(BaseModel):
    hours: float = Field(..., gt=0)
    start_time: Optional[str] = None


class CalculateCostResponse(BaseModel):
    spot_id: str
    hours: float
    estimated_cost: float
    currency: str = "USD"
    rate_applied: float
    breakdown: str


class SensorEventResponse(BaseModel):
    event: str = "SPOT_STATUS_CHANGED"
    spot_id: str
    name: Optional[str] = None
    status: str
    available_spots: int
    timestamp: datetime
