import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict
from server.schemas.visitor import VisitorOut


class VerificationBase(BaseModel):
    visitor_id: uuid.UUID
    officer_id: Optional[uuid.UUID] = None
    verification_status: str  # VERIFIED, REJECTED
    notes: Optional[str] = None


class VerificationCreate(VerificationBase):
    pass


class VerificationOut(VerificationBase):
    id: uuid.UUID
    created_at: datetime
    visitor: Optional[VisitorOut] = None

    model_config = ConfigDict(from_attributes=True)
