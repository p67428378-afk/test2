
from pydantic import BaseModel
from typing import Optional
from datetime import date

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str

    class Config:
        from_attributes = True

class NCBTierBase(BaseModel):
    years_no_claims: int
    discount_percentage: float

class NCBTierCreate(NCBTierBase):
    pass

class NCBTier(NCBTierBase):
    id: str

    class Config:
        from_attributes = True

class VehicleBase(BaseModel):
    make: str
    model: str
    year: int
    vin: str
    risk_factor: float
    vehicle_multiplier: float

class VehicleCreate(VehicleBase):
    pass

class Vehicle(VehicleBase):
    id: str

    class Config:
        from_attributes = True

class CustomerBase(BaseModel):
    first_name: str
    last_name: str
    date_of_birth: date
    driver_license_number: str
    address: str
    contact_number: str

class CustomerCreate(CustomerBase):
    pass

class Customer(CustomerBase):
    id: str

    class Config:
        from_attributes = True

class PolicyBase(BaseModel):
    base_rate: float
    calculated_premium: float
    effective_date: date
    expiry_date: date

class PolicyCreate(PolicyBase):
    customer_id: str
    vehicle_id: str
    ncb_tier_id: str

class Policy(PolicyBase):
    id: str
    customer: Customer
    vehicle: Vehicle
    ncb_tier: NCBTier

    class Config:
        from_attributes = True

class PremiumCalculationRequest(BaseModel):
    driver_age: int
    ncb_years: int
    vehicle_make: str
    vehicle_model: str
    vehicle_year: int
    vehicle_risk_factor: float

class PremiumCalculationResponse(BaseModel):
    calculated_premium: float
