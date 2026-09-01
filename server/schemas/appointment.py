import uuid
from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict
from server.schemas.visitor import VisitorOut
from server.schemas.inmate import InmateOut


class AppointmentBase(BaseModel):
    visitor_id: uuid.UUID
    inmate_id: uuid.UUID
    visit_date: date
    start_time: str
    relationship: str


class AppointmentCreate(AppointmentBase):
    pass


class AppointmentStatusUpdate(BaseModel):
    status: str
    rejection_reason: Optional[str] = None


class AppointmentOut(AppointmentBase):
    id: uuid.UUID
    status: str
    rejection_reason: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    visitor: Optional[VisitorOut] = None
    inmate: Optional[InmateOut] = None

    model_config = ConfigDict(from_attributes=True)
