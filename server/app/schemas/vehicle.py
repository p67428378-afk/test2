
from pydantic import BaseModel

class VehicleBase(BaseModel):
    make: str
    model: str
    year: int
    vin: str

class VehicleCreate(VehicleBase):
    pass

class Vehicle(VehicleBase):
    id: str

    class Config:
        orm_mode = True
