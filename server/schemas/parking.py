from datetime import datetime
from typing import Optional, List, Dict
from pydantic import BaseModel, Field, ConfigDict


class ParkingLocationCreate(BaseModel):
    name: str
    address: str
    latitude: float
    longitude: float
    spot_type: str = "garage"
    has_ev_charging: bool = False
    total_capacity: int = 50
    available_spots: Optional[int] = None
    base_rate_per_hour: float = 5.0
    peak_rate_per_hour: float = 8.0
    max_daily_rate: Optional[float] = 35.0


class ParkingSpotResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    spot_id: str
    id: str
    name: str
    address: str
    latitude: float
    longitude: float
    distance_km: Optional[float] = 0.0
    hourly_rate: float
    currency: str = "USD"
    status: str
    total_capacity: int
    available_spots: int
    spot_type: str
    has_ev_charging: bool
    is_peak_hours: bool = False
    base_hourly_rate: Optional[float] = None
    peak_rate_per_hour: Optional[float] = None
    max_daily_cap: Optional[float] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class ParkingSearchResponse(BaseModel):
    total: int
    spots: List[ParkingSpotResponse]


class HourlyRateBreakdown(BaseModel):
    standard_rate: str
    peak_rate: str
    weekend_rate: str


class HourlyRateResponse(BaseModel):
    spot_id: str
    base_hourly_rate: float
    currency: str = "USD"
    rate_breakdown: Dict[str, str]
    current_active_rate: float
    is_peak: bool
    max_daily_cap: Optional[float] = None


class CostCalculationRequest(BaseModel):
    hours: float = Field(..., gt=0)
    start_time: Optional[str] = None


class CostCalculationResponse(BaseModel):
    spot_id: str
    hours: float
    estimated_cost: float
    applied_rate_per_hour: float
    capped_at_daily_max: bool
    currency: str = "USD"


class SpotStatusUpdateRequest(BaseModel):
    status: Optional[str] = None
    available_spots: Optional[int] = None


class SpotStatusUpdateResponse(BaseModel):
    spot_id: str
    status: str
    available_spots: int
    updated_at: datetime


class SensorEventResponse(BaseModel):
    event: str = "SPOT_STATUS_CHANGED"
    spot_id: str
    name: Optional[str] = None
    status: str
    available_spots: Optional[int] = None
    timestamp: datetime
