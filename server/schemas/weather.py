from pydantic import BaseModel
import uuid
from typing import Optional, List, Dict, Any
from datetime import datetime

class VisualizationData(BaseModel):
    radar: Dict[str, Any]
    satellite: Dict[str, Any]
    sensors: Dict[str, Any]

class NWPModelOutput(BaseModel):
    model_name: str
    variable: str
    forecast_time: datetime
    grid_data: Dict[str, Any]

class ForecastGrid(BaseModel):
    id: uuid.UUID
    name: str
    created_by: str
    created_at: datetime
    updated_at: datetime

class ForecastGridUpdate(BaseModel):
    grid_data: Dict[str, Any]

class Warning(BaseModel):
    id: uuid.UUID
    warning_type: str
    severity: str
    issued_at: datetime
    expires_at: datetime
    polygon: Dict[str, Any]

class WarningCreate(BaseModel):
    warning_type: str
    severity: str
    start_time: datetime
    end_time: datetime
    polygon_coords: List[List[float]]
    details: str

class WarningUpdate(BaseModel):
    action: str
    new_end_time: Optional[datetime] = None
    reason: str

class TextProduct(BaseModel):
    id: uuid.UUID
    title: str
    product_code: str
    created_at: datetime

class TextProductCreate(BaseModel):
    title: str
    product_code: str
    content: str
