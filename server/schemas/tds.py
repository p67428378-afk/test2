
from pydantic import BaseModel, Field
from typing import List, Optional
from uuid import UUID
from datetime import datetime

class TDSConfiguration(BaseModel):
    config_id: UUID = Field(..., alias='id')
    customer_category: str
    min_interest_threshold: float
    tds_rate: float
    effective_date: datetime
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
        allow_population_by_field_name = True

class TDSConfigurationUpdate(BaseModel):
    min_interest_threshold: float
    tds_rate: float
    effective_date: datetime

class TDSConfigurationsResponse(BaseModel):
    configurations: List[TDSConfiguration]
