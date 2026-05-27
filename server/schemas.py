
from pydantic import BaseModel, ConfigDict
from decimal import Decimal
import uuid
from datetime import datetime

class AlertRuleBase(BaseModel):
    account_number: str
    threshold_amount: Decimal
    delivery_channel: str

class AlertRuleCreate(AlertRuleBase):
    pass

class AlertRuleResponse(BaseModel):
    status: str
    confirmed_threshold: Decimal
    delivery_channel: str

class AlertRule(AlertRuleBase):
    id: uuid.UUID
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
