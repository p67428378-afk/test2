from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, date
from uuid import UUID

# --- Body Schemas ---
class BodyBase(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    date_of_death: Optional[date] = None
    intake_date: Optional[datetime] = None
    release_date: Optional[datetime] = None
    status: str = "intake"
    location: str

class BodyCreate(BodyBase):
    intake_date: datetime

class BodyUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    date_of_death: Optional[date] = None
    release_date: Optional[datetime] = None
    status: Optional[str] = None
    location: Optional[str] = None

class BodyResponse(BodyBase):
    body_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        orm_mode = True


# --- Funeral Schemas ---
class FuneralBase(BaseModel):
    body_id: UUID
    service_type: str
    service_date: datetime
    notes: Optional[str] = None
    assigned_resources: Optional[str] = None
    status: str = "scheduled"

class FuneralCreate(FuneralBase):
    pass

class FuneralUpdate(BaseModel):
    service_type: Optional[str] = None
    service_date: Optional[datetime] = None
    notes: Optional[str] = None
    assigned_resources: Optional[str] = None
    status: Optional[str] = None

class FuneralResponse(FuneralBase):
    funeral_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        orm_mode = True


# --- Invoice Item Schemas ---
class InvoiceItemBase(BaseModel):
    description: str
    amount: float

class InvoiceItemCreate(InvoiceItemBase):
    pass

class InvoiceItemResponse(InvoiceItemBase):
    item_id: UUID
    invoice_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        orm_mode = True


# --- Invoice Schemas ---
class InvoiceBase(BaseModel):
    funeral_id: UUID
    total_amount: float
    paid_amount: float
    status: str = "unpaid"

class InvoiceCreate(InvoiceBase):
    items: List[InvoiceItemCreate] = []

class InvoiceUpdate(BaseModel):
    paid_amount: Optional[float] = None
    status: Optional[str] = None

class InvoiceResponse(InvoiceBase):
    invoice_id: UUID
    items: List[InvoiceItemResponse] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        orm_mode = True
