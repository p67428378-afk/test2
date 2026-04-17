from pydantic import BaseModel, ConfigDict
from datetime import date
import uuid

class PolicyBase(BaseModel):
    plan_type: str
    premium_amount: float
    effective_date: date
    expiration_date: date

class PolicyCreate(PolicyBase):
    policy_holder_id: str
    policy_number: str

class PolicyUpdate(PolicyBase):
    pass

class PolicyInDBBase(PolicyBase):
    id: uuid.UUID
    policy_holder_id: str
    policy_number: str
    status: str

    model_config = ConfigDict(from_attributes=True)

class Policy(PolicyInDBBase):
    pass
