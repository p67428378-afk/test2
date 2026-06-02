
from pydantic import BaseModel
import uuid

class AlertConfigBase(BaseModel):
    threshold_percentage: int
    leak_detection_period_hours: int

class AlertConfigCreate(AlertConfigBase):
    user_id: uuid.UUID

class AlertConfigUpdate(AlertConfigBase):
    pass

class AlertConfig(AlertConfigBase):
    config_id: uuid.UUID
    user_id: uuid.UUID

    class Config:
        orm_mode = True
