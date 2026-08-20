from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field


# --- Apiary Schemas ---
class ApiaryBase(BaseModel):
    name: str = Field(..., example="Sunny Valley Apiary")
    location: str = Field(..., example="North Ridge, Plot 4B")
    notes: Optional[str] = None


class ApiaryCreate(ApiaryBase):
    pass


class ApiaryResponse(ApiaryBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Hive Schemas ---
class HiveBase(BaseModel):
    apiary_id: str
    hive_number: str = Field(..., example="HIVE-01")
    queen_breed: Optional[str] = Field(None, example="Italian Honeybee")
    queen_installed_date: Optional[date] = None
    status: str = Field("active", example="active")
    estimated_population: int = Field(0, ge=0, example=45000)
    frame_count: int = Field(10, ge=1, example=10)


class HiveCreate(HiveBase):
    pass


class HiveUpdate(BaseModel):
    hive_number: Optional[str] = None
    queen_breed: Optional[str] = None
    queen_installed_date: Optional[date] = None
    status: Optional[str] = None
    estimated_population: Optional[int] = None
    frame_count: Optional[int] = None


class HiveResponse(HiveBase):
    id: str
    density_bees_per_frame: float = Field(0.0)
    density_status: str = Field("Optimal")
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Telemetry Schemas ---
class TelemetryIngestRequest(BaseModel):
    hive_id: str
    temperature_celsius: float = Field(..., example=34.5)
    humidity_percent: float = Field(..., example=60.2)
    weight_kg: Optional[float] = Field(None, example=42.1)
    recorded_at: Optional[datetime] = None


class TelemetryIngestResponse(BaseModel):
    id: str
    hive_id: str
    status: str = "ingested"
    alert_triggered: bool = False
    alert_message: Optional[str] = None


class TelemetryLogResponse(BaseModel):
    id: str
    hive_id: str
    temperature_celsius: float
    humidity_percent: float
    weight_kg: Optional[float] = None
    recorded_at: datetime
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Honey Harvest Schemas ---
class HoneyHarvestBase(BaseModel):
    hive_id: str
    harvest_date: date
    quantity_kg: float = Field(..., gt=0, example=25.5)
    honey_type: Optional[str] = Field(None, example="Wildflower")
    moisture_content_percent: Optional[float] = Field(None, example=17.5)


class HoneyHarvestCreate(HoneyHarvestBase):
    pass


class HoneyHarvestResponse(HoneyHarvestBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Disease Report Schemas ---
class DiseaseReportBase(BaseModel):
    hive_id: str
    disease_name: str = Field(..., example="Varroa Mites")
    severity_level: str = Field(..., example="Medium")  # Low, Medium, High, Critical
    symptoms_description: str = Field(
        ..., example="Elevated mite count found on sticky board."
    )
    treatment_applied: Optional[str] = Field(None, example="Applied formic acid strip.")


class DiseaseReportCreate(DiseaseReportBase):
    report_date: Optional[datetime] = None


class DiseaseReportResponse(DiseaseReportBase):
    id: str
    report_date: datetime
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Inspection Schemas ---
class InspectionBase(BaseModel):
    hive_id: str
    scheduled_date: datetime
    inspector_name: str = Field(..., example="John Beekeeper")
    status: str = Field("scheduled", example="scheduled")
    notes: Optional[str] = None


class InspectionCreate(InspectionBase):
    pass


class InspectionUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None
    completed_at: Optional[datetime] = None


class InspectionResponse(InspectionBase):
    id: str
    completed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Seasonal Analytics Schema ---
class SeasonalTrendPoint(BaseModel):
    date: str
    avg_temperature: float
    avg_humidity: float
    total_harvest_kg: float


class SeasonalAnalyticsResponse(BaseModel):
    hive_id: Optional[str] = None
    season: str
    year: int
    total_harvest_yield_kg: float
    avg_temperature_celsius: float
    avg_humidity_percent: float
    estimated_bee_population: int
    active_disease_alerts_count: int
    completed_inspections_count: int
    trends: List[SeasonalTrendPoint] = []
