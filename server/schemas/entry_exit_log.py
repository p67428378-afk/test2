import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict
from server.schemas.appointment import AppointmentOut


class CheckInRequest(BaseModel):
    appointment_id: uuid.UUID
    officer_id: Optional[uuid.UUID] = None


class CheckOutRequest(BaseModel):
    appointment_id: Optional[uuid.UUID] = None
    log_id: Optional[uuid.UUID] = None
    officer_id: Optional[uuid.UUID] = None


class EntryExitLogOut(BaseModel):
    id: uuid.UUID
    appointment_id: uuid.UUID
    officer_id: Optional[uuid.UUID] = None
    check_in_time: Optional[datetime] = None
    check_out_time: Optional[datetime] = None
    created_at: datetime
    appointment: Optional[AppointmentOut] = None

    model_config = ConfigDict(from_attributes=True)
