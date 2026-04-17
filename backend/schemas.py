
from pydantic import BaseModel
import uuid
from datetime import datetime
from .models import KYCStatus

class KYCRequestCreate(BaseModel):
    aadhaar_number: str
    pan_number: str

class KYCRequest(BaseModel):
    id: uuid.UUID
    aadhaar_number: str
    pan_number: str
    status: KYCStatus
    created_at: datetime
    updated_at: datetime | None = None

    class Config:
        from_attributes = True

class AuditTrail(BaseModel):
    id: uuid.UUID
    kyc_request_id: uuid.UUID
    action: str
    details: str
    timestamp: datetime

    class Config:
        from_attributes = True
