
from pydantic import BaseModel, UUID4
from typing import Optional, List, Any
from datetime import datetime
# from geojson_pydantic.geometries import Polygon

class SensorData(BaseModel):
    source: str
    timestamp: datetime
    latitude: float
    longitude: float
    data: Any

    class Config:
        orm_mode = True

class NwpModelOutput(BaseModel):
    model_name: str
    run_time: datetime
    forecast_time: datetime
    variable: str
    grid_data: Any

    class Config:
        orm_mode = True

class ForecastGridBase(BaseModel):
    name: str
    grid_data: Any

class ForecastGridCreate(ForecastGridBase):
    pass

class ForecastGrid(ForecastGridBase):
    id: UUID4
    user_id: UUID4
    version: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class WarningBase(BaseModel):
    warning_type: str
    severity: str
    # polygon: Polygon
    issued_at: datetime
    expires_at: datetime
    status: str = 'active'

class WarningCreate(BaseModel):
    warning_type: str
    severity: str
    details: str
    polygon_coords: List
    start_time: datetime
    end_time: datetime

class WarningUpdate(BaseModel):
    action: str
    new_end_time: Optional[datetime] = None
    reason: str

class Warning(WarningBase):
    id: UUID4
    user_id: UUID4
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class TextProductBase(BaseModel):
    title: str
    product_code: str
    content: str

class TextProductCreate(TextProductBase):
    pass

class TextProduct(TextProductBase):
    id: UUID4
    user_id: UUID4
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class VisualizationData(BaseModel):
    radar: Any
    satellite: Any
    sensors: Any
