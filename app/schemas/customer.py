
from pydantic import BaseModel
from typing import Optional, List, Any
from uuid import UUID
from datetime import datetime

class CustomerBase(BaseModel):
    name: str
    contact_information: Optional[dict] = None

class CustomerCreate(CustomerBase):
    pass

class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    contact_information: Optional[dict] = None

class Customer(CustomerBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    purchase_history: List[Any] = []

    class Config:
        orm_mode = True
