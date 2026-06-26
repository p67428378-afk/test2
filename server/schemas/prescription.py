from datetime import datetime
from pydantic import BaseModel, ConfigDict


class PrescriptionBase(BaseModel):
    medical_record_id: str
    medication_id: str
    dosage: str
    frequency: str
    duration: str


class PrescriptionCreate(PrescriptionBase):
    pass


class PrescriptionResponse(PrescriptionBase):
    id: str
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
