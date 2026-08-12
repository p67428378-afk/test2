from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict


# Route Schemas
class RouteBase(BaseModel):
    name: str
    code: str
    color_code: Optional[str] = "#0D9488"


class RouteCreate(RouteBase):
    pass


class RouteResponse(RouteBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# Station Schemas
class StationBase(BaseModel):
    name: str
    code: str
    latitude: float
    longitude: float


class StationCreate(StationBase):
    pass


class StationResponse(StationBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# Train Schemas
class TrainBase(BaseModel):
    train_number: str
    route_id: Optional[str] = None
    status: Optional[str] = "active"


class TrainCreate(TrainBase):
    latitude: Optional[float] = 0.0
    longitude: Optional[float] = 0.0
    speed: Optional[float] = 0.0
    heading: Optional[float] = 0.0


class TrainResponse(TrainBase):
    id: str
    latitude: Optional[float] = 0.0
    longitude: Optional[float] = 0.0
    speed: Optional[float] = 0.0
    heading: Optional[float] = 0.0
    last_telemetry_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    route: Optional[RouteResponse] = None

    model_config = ConfigDict(from_attributes=True)


class ScheduleResponse(BaseModel):
    id: str
    train_id: str
    station_id: str
    scheduled_arrival: datetime
    scheduled_departure: datetime
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class DelayAlertResponse(BaseModel):
    id: str
    train_id: str
    delay_minutes: int
    reason: Optional[str] = None
    is_resolved: bool = False
    created_at: datetime
    updated_at: datetime
    train_number: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class TrainDetailResponse(TrainResponse):
    schedules: List[ScheduleResponse] = []
    delay_alerts: List[DelayAlertResponse] = []

    model_config = ConfigDict(from_attributes=True)


# Schedule Schemas
class ScheduleBase(BaseModel):
    train_id: str
    station_id: str
    scheduled_arrival: datetime
    scheduled_departure: datetime


class ScheduleCreate(ScheduleBase):
    pass


class StationScheduleResponse(BaseModel):
    schedule_id: str
    train_id: str
    train_number: str
    station_id: str
    station_name: str
    scheduled_arrival: datetime
    scheduled_departure: datetime
    delay_minutes: int = 0
    predicted_eta: datetime
    status: str = "on_time"

    model_config = ConfigDict(from_attributes=True)


# Telemetry & Location Log Schemas
class TelemetryPayload(BaseModel):
    train_id: str
    latitude: float
    longitude: float
    speed: Optional[float] = 0.0
    heading: Optional[float] = 0.0
    delay_minutes: Optional[int] = 0
    recorded_at: Optional[datetime] = None


class LocationLogResponse(BaseModel):
    id: str
    train_id: str
    latitude: float
    longitude: float
    speed: float
    heading: float
    recorded_at: datetime

    model_config = ConfigDict(from_attributes=True)


# Delay Alert Schemas
class DelayAlertBase(BaseModel):
    train_id: str
    delay_minutes: int
    reason: Optional[str] = None
    is_resolved: bool = False


class DelayAlertCreate(DelayAlertBase):
    pass


# WebSocket Message Schema
class WSLocationBroadcast(BaseModel):
    event: str = "location_update"
    train_id: str
    train_number: str
    latitude: float
    longitude: float
    speed: float
    heading: float
    status: str
    last_telemetry_at: Optional[datetime] = None


# Health Check
class HealthResponse(BaseModel):
    status: str
    database: str
    timestamp: datetime
