
from pydantic import BaseModel
import uuid
from datetime import datetime

class AuditTrailBase(BaseModel):
    customer_id: uuid.UUID
    action: str
    status: str
    details: str = None

class AuditTrailCreate(AuditTrailBase):
    pass

class AuditTrailInDBBase(AuditTrailBase):
    id: uuid.UUID
    timestamp: datetime

    class Config:
        orm_mode = True

class AuditTrail(AuditTrailInDBBase):
    pass
