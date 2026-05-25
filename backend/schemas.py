
from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime
from .models import RequestType, RequestStatus

class Policy(BaseModel):
    policy_id: str
    policy_holder_id: str
    policy_type: str
    effective_date: datetime
    expiration_date: datetime
    premium_amount: float
    status: str
    beneficiaries: list[str]

class PolicyChangeRequestBase(BaseModel):
    policy_id: str
    request_type: RequestType
    request_details: Optional[Dict[str, Any]] = None

class PolicyChangeRequestCreate(PolicyChangeRequestBase):
    submitted_by: str

class PolicyChangeRequest(PolicyChangeRequestBase):
    id: int
    request_status: RequestStatus
    submitted_at: datetime
    submitted_by: str
    processed_by: Optional[str] = None
    processed_at: Optional[datetime] = None

    class Config:
        from_attributes = True
