from datetime import datetime, date as date_type
from typing import List, Optional
from pydantic import BaseModel


# Auth Schemas
class UserRegister(BaseModel):
    username: str
    email: str
    password: str


class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


# Sensor Data Schemas
class SensorDataCreate(BaseModel):
    temperature: float
    humidity: float
    timestamp: datetime


class SensorDataResponse(BaseModel):
    id: str
    hive_id: str
    temperature: float
    humidity: float
    timestamp: datetime

    class Config:
        from_attributes = True


# Production Log Schemas
class ProductionLogCreate(BaseModel):
    date: date_type
    quantity_kg: float


class ProductionLogResponse(BaseModel):
    id: str
    hive_id: str
    date: date_type
    quantity_kg: float
    created_at: datetime

    class Config:
        from_attributes = True


# Population Log Schemas
class PopulationLogCreate(BaseModel):
    date: date_type
    estimated_population: int


class PopulationLogResponse(BaseModel):
    id: str
    hive_id: str
    date: date_type
    estimated_population: int
    created_at: datetime

    class Config:
        from_attributes = True


# Inspection Schemas
class InspectionCreate(BaseModel):
    inspection_date: date_type
    inspector: Optional[str] = None
    focus_area: Optional[str] = None
    notes: Optional[str] = None


class InspectionResponse(BaseModel):
    id: str
    hive_id: str
    inspection_date: date_type
    inspector: Optional[str] = None
    focus_area: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# Disease Report Schemas
class DiseaseReportCreate(BaseModel):
    report_date: date_type
    symptoms: Optional[str] = None
    severity: Optional[str] = None
    observations: Optional[str] = None
    status: Optional[str] = "pending"


class DiseaseReportResponse(BaseModel):
    id: str
    hive_id: str
    report_date: date_type
    symptoms: Optional[str] = None
    severity: Optional[str] = None
    observations: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


# Hive Schemas
class HiveCreate(BaseModel):
    name: str
    location: str
    status: Optional[str] = "healthy"
    honey_capacity_pct: Optional[float] = 0.0


class HiveResponse(BaseModel):
    id: str
    name: str
    location: str
    status: str
    honey_capacity_pct: float
    created_at: datetime

    class Config:
        from_attributes = True


class LatestSensorData(BaseModel):
    temperature: float
    humidity: float
    timestamp: datetime


class HiveListResponse(BaseModel):
    id: str
    name: str
    location: str
    status: str
    honey_capacity_pct: float
    latest_sensor_data: Optional[LatestSensorData] = None

    class Config:
        from_attributes = True


class HiveDetailResponse(BaseModel):
    id: str
    name: str
    location: str
    status: str
    honey_capacity_pct: float
    sensor_history_24h: List[SensorDataResponse] = []
    production_logs: List[ProductionLogResponse] = []
    population_logs: List[PopulationLogResponse] = []
    inspections: List[InspectionResponse] = []
    disease_reports: List[DiseaseReportResponse] = []

    class Config:
        from_attributes = True
