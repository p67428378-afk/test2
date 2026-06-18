from datetime import datetime
from pydantic import BaseModel


class AuditLogResponse(BaseModel):
    log_id: str
    action: str
    actor: str
    details: str
    timestamp: datetime

    class Config:
        from_attributes = True
