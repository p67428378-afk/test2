from pydantic import BaseModel, Field
from typing import Optional
import uuid
from datetime import datetime
from app.models.kyc import KYCStatus

class KYCCreate(BaseModel):
    customer_id: str
    aadhaar_number: str
    pan_number: str

class KYCResponse(BaseModel):
    id: uuid.UUID
    customer_id: str
    final_kyc_status: KYCStatus
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True

class AuditLogResponse(BaseModel):
    id: uuid.UUID
    kyc_id: uuid.UUID
    event_timestamp: datetime
    event_type: str
    event_details: Optional[dict]
    service_involved: str
    outcome: str
    initiator: str

    class Config:
        orm_mode = True
