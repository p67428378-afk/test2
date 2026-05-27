from pydantic import BaseModel, Field, ConfigDict
from decimal import Decimal
import uuid

class AlertRuleBase(BaseModel):
    account_number: str
    threshold_amount: Decimal = Field(..., gt=0)
    delivery_channel: str

class AlertRuleCreate(AlertRuleBase):
    pass

class AlertRuleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    status: str
    confirmed_threshold: Decimal
    delivery_channel: str
