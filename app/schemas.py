from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime
from decimal import Decimal

class VehicleBase(BaseModel):
    make: str
    model: str
    year: int = Field(..., gt=1900, lt=datetime.now().year + 1)
    vin: Optional[str] = None

class VehicleCreate(VehicleBase):
    pass

class Vehicle(VehicleBase):
    vehicle_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class CustomerBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone_number: str
    address: str

class CustomerCreate(CustomerBase):
    pass

class Customer(CustomerBase):
    customer_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class PolicyBase(BaseModel):
    customer_id: str
    vehicle_id: str
    base_rate: Decimal = Field(..., gt=0)
    ncb_percentage: Decimal = Field(..., ge=0.0, le=0.5) # 0% to 50% cap
    vehicle_multiplier: Decimal = Field(..., ge=0.8, le=1.6) # 0.8x to 1.6x

class PolicyCreate(PolicyBase):
    pass

class Policy(PolicyBase):
    policy_id: str
    calculated_premium: Decimal
    currency: str
    created_at: datetime
    updated_at: datetime
    customer: Customer # Eagerly loaded relationship
    vehicle: Vehicle # Eagerly loaded relationship

    class Config:
        from_attributes = True

class PremiumCalculationRequest(BaseModel):
    base_rate: Decimal = Field(..., gt=0)
    ncb_percentage: Decimal = Field(..., ge=0.0, le=0.5) # 0% to 50% cap
    vehicle_multiplier: Decimal = Field(..., ge=0.8, le=1.6) # 0.8x to 1.6x
    vehicle_details: VehicleCreate
    customer_details: CustomerCreate

class PremiumCalculationResponse(BaseModel):
    calculated_premium: Decimal
    currency: str = "USD"
    policy_id: str
