from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from typing import List, Optional
from uuid import UUID


# Base Config
class BaseSchema(BaseModel):
    class Config:
        from_attributes = True


# Schedule Schemas
class ScheduleCreate(BaseModel):
    vessel_name: str
    route: str
    start_date: datetime
    end_date: datetime
    destination_port: str = Field(..., max_length=10)
    status: str = "Planned"
    notes: Optional[str] = None

    @field_validator("status")
    @classmethod
    def validate_status(cls, v):
        allowed = ["Planned", "Underway", "Completed"]
        if v not in allowed:
            raise ValueError(f"Status must be one of {allowed}")
        return v

    @field_validator("end_date")
    @classmethod
    def validate_dates(cls, v, info):
        if "start_date" in info.data and v < info.data["start_date"]:
            raise ValueError("end_date cannot be before start_date")
        return v


class ScheduleUpdate(BaseModel):
    vessel_name: Optional[str] = None
    route: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    destination_port: Optional[str] = Field(None, max_length=10)
    status: Optional[str] = None
    notes: Optional[str] = None

    @field_validator("status")
    @classmethod
    def validate_status(cls, v):
        if v is not None:
            allowed = ["Planned", "Underway", "Completed"]
            if v not in allowed:
                raise ValueError(f"Status must be one of {allowed}")
        return v


class ScheduleResponse(BaseSchema):
    id: UUID
    vessel_name: str
    route: str
    start_date: datetime
    end_date: datetime
    destination_port: str
    status: str
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime


# Expedition Schemas
class ExpeditionCreate(BaseModel):
    name: str
    schedule_id: UUID
    start_date: datetime
    end_date: datetime
    research_goals: str

    @field_validator("end_date")
    @classmethod
    def validate_dates(cls, v, info):
        if "start_date" in info.data and v < info.data["start_date"]:
            raise ValueError("end_date cannot be before start_date")
        return v


class ExpeditionResponse(BaseSchema):
    id: UUID
    name: str
    schedule_id: UUID
    start_date: datetime
    end_date: datetime
    research_goals: str
    created_at: datetime
    updated_at: datetime


# Equipment Schemas
class EquipmentCreate(BaseModel):
    name: str
    serial_number: str
    status: str = "Operational"
    location: str
    last_maintenance_date: Optional[datetime] = None


class EquipmentUpdate(BaseModel):
    status: Optional[str] = None
    location: Optional[str] = None
    last_maintenance_date: Optional[datetime] = None

    @field_validator("status")
    @classmethod
    def validate_status(cls, v):
        if v is not None:
            allowed = ["Operational", "Needs Maintenance", "In Repair"]
            if v not in allowed:
                raise ValueError(f"Status must be one of {allowed}")
        return v


class EquipmentResponse(BaseSchema):
    id: UUID
    name: str
    serial_number: str
    status: str
    location: str
    last_maintenance_date: Optional[datetime]
    created_at: datetime
    updated_at: datetime


# Fuel Log Schemas
class FuelLogCreate(BaseModel):
    vessel_id: str
    fuel_consumed: float
    distance_traveled: float
    timestamp: Optional[datetime] = None


class FuelLogResponse(BaseSchema):
    id: UUID
    vessel_id: str
    timestamp: datetime
    fuel_consumed: float
    distance_traveled: float


class FuelSummaryResponse(BaseModel):
    average_efficiency: float
    total_distance_traveled: float
    total_fuel_consumed: float
    logs: List[FuelLogResponse]


# Weather Schemas
class WeatherAlert(BaseModel):
    message: str
    severity: str
    source: str


class WeatherAlertsResponse(BaseModel):
    alerts: List[WeatherAlert]


# Crew Schemas
class CrewCreate(BaseModel):
    first_name: str
    last_name: str
    certification: str


class CrewResponse(BaseSchema):
    id: UUID
    first_name: str
    last_name: str
    certification: str
    created_at: datetime
    updated_at: datetime


class CrewAssignmentCreate(BaseModel):
    crew_id: UUID
    role: str


class CrewAssignmentResponse(BaseModel):
    crew_id: UUID
    expedition_id: UUID
    role: str


class CrewWithRoleResponse(BaseModel):
    id: UUID
    first_name: str
    last_name: str
    certification: str
    role: str


# Sample Schemas
class SampleCreate(BaseModel):
    expedition_id: UUID
    sample_type: str
    collection_date: datetime
    storage_location: str
    notes: Optional[str] = None


class SampleResponse(BaseSchema):
    id: UUID
    expedition_id: UUID
    sample_type: str
    collection_date: datetime
    storage_location: str
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime
