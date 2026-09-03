from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict


class HourlyRateBase(BaseModel):
    base_rate_per_hour: float = Field(..., ge=0)
    peak_rate_per_hour: float = Field(..., ge=0)
    off_peak_rate_per_hour: float = Field(..., ge=0)
    weekend_rate_per_hour: float = Field(..., ge=0)
    max_daily_rate: float = Field(..., ge=0)


class HourlyRateCreate(HourlyRateBase):
    location_id: Optional[str] = None


class HourlyRateResponse(HourlyRateBase):
    id: str
    location_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ParkingSpotBase(BaseModel):
    spot_number: str = Field(..., min_length=1, max_length=50)
    status: str = Field(default="available")
    category: Optional[str] = Field(default="Car")


class ParkingSpotCreate(ParkingSpotBase):
    location_id: Optional[str] = None


class ParkingSpotResponse(ParkingSpotBase):
    id: str
    location_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ParkingLocationBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    address: str = Field(..., min_length=1, max_length=500)
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    spot_type: str = Field(default="garage")
    category: str = Field(default="Car")
    has_ev_charging: bool = Field(default=False)
    total_capacity: int = Field(default=50, ge=1)
    available_spots: int = Field(default=10, ge=0)
    status: str = Field(default="available")


class ParkingLocationCreate(ParkingLocationBase):
    rates: Optional[HourlyRateBase] = None


class ParkingLocationResponse(ParkingLocationBase):
    id: str
    created_at: datetime
    updated_at: datetime
    rates: Optional[List[HourlyRateResponse]] = None
    spots: Optional[List[ParkingSpotResponse]] = None

    model_config = ConfigDict(from_attributes=True)


class ParkingSpotSearchResult(BaseModel):
    spot_id: str
    name: str
    address: str
    latitude: float
    longitude: float
    distance_km: float
    hourly_rate: float
    status: str
    available_spots: int
    total_capacity: int
    has_ev_charging: bool
    spot_type: str
    category: str

    model_config = ConfigDict(from_attributes=True)


class RatesBreakdownResponse(BaseModel):
    spot_id: str
    base_hourly_rate: float
    current_active_rate: float
    is_peak: bool
    max_daily_cap: float
    rate_breakdown: dict

    model_config = ConfigDict(from_attributes=True)


class CostCalculationRequest(BaseModel):
    hours: float = Field(..., gt=0)
    start_time: Optional[str] = None


class CostCalculationResponse(BaseModel):
    spot_id: str
    hours: float
    total_cost: float
    rate_applied: float
    is_peak: bool
    max_daily_cap_applied: bool


class StatusUpdateRequest(BaseModel):
    status: Optional[str] = None
    available_spots: Optional[int] = None


class EventResponse(BaseModel):
    id: str
    event: str
    spot_id: Optional[str] = None
    location_id: str
    status: str
    available_spots: int
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)
