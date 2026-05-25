from pydantic import BaseModel, ConfigDict
from typing import Optional
import uuid
from datetime import datetime
from backend.app.models.kyc import KYCStatus

class KYCCreate(BaseModel):
    aadhaar_number: str
    pan_number: str

class KYCUpdate(BaseModel):
    status: KYCStatus

class KYCInDB(BaseModel):
    id: uuid.UUID
    aadhaar_number: str
    pan_number: str
    status: KYCStatus
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class KYCResponse(BaseModel):
    id: uuid.UUID
    status: KYCStatus
