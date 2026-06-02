
from pydantic import BaseModel
from uuid import UUID

class AlertConfigBase(BaseModel):
    threshold_percentage: int
    leak_detection_period_hours: int

class AlertConfigCreate(AlertConfigBase):
    user_id: UUID

class AlertConfig(AlertConfigBase):
    config_id: UUID
    user_id: UUID

    class Config:
        orm_mode = True
