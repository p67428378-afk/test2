from typing import Optional
from pydantic import BaseModel, ConfigDict


class MedicationBase(BaseModel):
    name: str
    code: str
    description: Optional[str] = None
    price: float
    stock_quantity: int


class MedicationCreate(MedicationBase):
    pass


class MedicationResponse(MedicationBase):
    id: str

    model_config = ConfigDict(from_attributes=True)
