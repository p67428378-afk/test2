from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime

class TDSConfigurationBase(BaseModel):
    customer_category: str
    min_interest_threshold: float
    tds_rate: float
    effective_date: datetime

class TDSConfigurationCreate(TDSConfigurationBase):
    pass

class TDSConfigurationUpdate(BaseModel):
    min_interest_threshold: Optional[float] = None
    tds_rate: Optional[float] = None
    effective_date: Optional[datetime] = None

class TDSConfiguration(TDSConfigurationBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class TDSConfigurationsResponse(BaseModel):
    configurations: List[TDSConfiguration]
