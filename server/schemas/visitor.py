import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr


class VisitorBase(BaseModel):
    full_name: str
    national_id: str
    email: EmailStr
    phone: Optional[str] = None
    address: Optional[str] = None
    photo_id_url: Optional[str] = None


class VisitorCreate(VisitorBase):
    pass


class VisitorUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    photo_id_url: Optional[str] = None
    verification_status: Optional[str] = None


class VisitorOut(VisitorBase):
    id: uuid.UUID
    verification_status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
