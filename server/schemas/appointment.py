from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class AppointmentBase(BaseModel):
    appointment_date: datetime
    doctor_id: str
    patient_id: str
    notes: Optional[str] = None


class AppointmentCreate(AppointmentBase):
    pass


class AppointmentResponse(AppointmentBase):
    id: str
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AppointmentListResponse(BaseModel):
    id: str
    patient_id: str
    patient_name: str
    doctor_id: str
    doctor_name: str
    appointment_date: datetime
    status: str
    notes: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
