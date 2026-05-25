from pydantic import BaseModel, ConfigDict
from datetime import date
from typing import Optional, List

class PremiumCalculationRequest(BaseModel):
    baseRate: float
    claimFreeYears: int
    vehicleMultiplier: float

class PremiumCalculationResponse(BaseModel):
    premium: float

class NCBHistoryBase(BaseModel):
    claim_free_years: int
    ncb_discount_percentage: float
    last_claim_date: Optional[date] = None

class NCBHistoryCreate(NCBHistoryBase):
    pass

class NCBHistory(NCBHistoryBase):
    id: str
    model_config = ConfigDict(from_attributes=True)

class DriverBase(BaseModel):
    name: str
    age: int
    license_number: str

class DriverCreate(DriverBase):
    ncb_history: NCBHistoryCreate

class Driver(DriverBase):
    id: str
    ncb_history: NCBHistory
    model_config = ConfigDict(from_attributes=True)

class VehicleBase(BaseModel):
    make: str
    model: str
    year: int
    type: str
    power: float
    vehicle_multiplier: float

class VehicleCreate(VehicleBase):
    pass

class Vehicle(VehicleBase):
    id: str
    model_config = ConfigDict(from_attributes=True)

class PolicyBase(BaseModel):
    policy_number: str
    policyholder_name: str
    policy_start_date: date
    policy_end_date: date
    base_premium: float
    calculated_premium: float
    status: str

class PolicyCreate(PolicyBase):
    driver: DriverCreate
    vehicles: List[VehicleCreate]

class Policy(PolicyBase):
    id: str
    driver: Driver
    vehicles: List[Vehicle]
    model_config = ConfigDict(from_attributes=True)
