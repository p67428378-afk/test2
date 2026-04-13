
from pydantic import BaseModel, Field
from typing import Optional
import uuid
from datetime import datetime

class CustomerBase(BaseModel):
    aadhaar_number: str = Field(..., min_length=12, max_length=12)
    pan_number: str = Field(..., min_length=10, max_length=10)

class CustomerCreate(CustomerBase):
    pass

class CustomerUpdate(CustomerBase):
    status: Optional[str] = None

class CustomerInDBBase(CustomerBase):
    id: uuid.UUID
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class Customer(CustomerInDBBase):
    pass
