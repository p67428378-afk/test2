import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class InmateBase(BaseModel):
    inmate_number: str
    full_name: str
    cell_location: str
    status: str = "ACTIVE"


class InmateCreate(InmateBase):
    pass


class InmateUpdate(BaseModel):
    full_name: Optional[str] = None
    cell_location: Optional[str] = None
    status: Optional[str] = None


class InmateOut(InmateBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
