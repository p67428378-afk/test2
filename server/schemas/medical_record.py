from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class MedicalRecordBase(BaseModel):
    patient_id: str
    doctor_id: str
    visit_date: date
    symptoms: str
    diagnosis: str
    treatment_plan: Optional[str] = None


class MedicalRecordCreate(MedicalRecordBase):
    pass


class MedicalRecordResponse(MedicalRecordBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
