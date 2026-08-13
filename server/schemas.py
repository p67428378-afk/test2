from datetime import datetime
from typing import Optional, List, Any, Dict
from pydantic import BaseModel, EmailStr, Field


# Auth Schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    role: Optional[str] = "RENTER"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    email: str
    full_name: Optional[str] = None
    role: str
    is_active: bool
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# Equipment Schemas
class EquipmentCreate(BaseModel):
    name: str
    category: str  # CAMERAS, DRONES, CONSTRUCTION_TOOLS
    daily_rate: float = Field(gt=0)
    deposit_amount: float = Field(ge=0)
    specifications: Optional[Dict[str, Any]] = None


class EquipmentUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    daily_rate: Optional[float] = None
    deposit_amount: Optional[float] = None
    status: Optional[str] = None
    specifications: Optional[Dict[str, Any]] = None


class EquipmentResponse(BaseModel):
    id: str
    name: str
    category: str
    daily_rate: float
    deposit_amount: float
    status: str
    specifications: Optional[Dict[str, Any]] = None
    version: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Rental Schemas
class RentalCreate(BaseModel):
    equipment_id: str
    start_date: datetime
    end_date: datetime
    payment_method_token: Optional[str] = "pm_mock_token"


class RentalStatusUpdate(BaseModel):
    status: str  # CHECKED_OUT, ACTIVE, RETURNED, OVERDUE


class RentalResponse(BaseModel):
    id: str
    user_id: str
    equipment_id: str
    start_date: datetime
    end_date: datetime
    actual_return_date: Optional[datetime] = None
    status: str
    payment_method_token: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    equipment: Optional[EquipmentResponse] = None

    class Config:
        from_attributes = True


# Deposit Hold Schemas
class DepositHoldCreate(BaseModel):
    rental_id: str
    amount: float
    payment_method_id: Optional[str] = "pm_mock_id"


# Transaction Schemas
class TransactionResponse(BaseModel):
    id: str
    rental_id: str
    transaction_type: str  # DEPOSIT, RENTAL_FEE, LATE_FEE, REFUND
    amount: float
    status: str
    payment_gateway_ref: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# Return Check-In Schemas
class ReturnCheckInRequest(BaseModel):
    rental_id: str
    actual_return_date: Optional[datetime] = None
    damage_assessment_amount: float = 0.0


class ReturnCheckInResponse(BaseModel):
    rental_id: str
    status: str
    days_rented: int
    days_late: int
    daily_rate: float
    rental_fee: float
    deposit_amount: float
    late_fee: float
    damage_assessment: float
    total_deductions: float
    refund_amount: float
    excess_charged: float
    transactions: List[TransactionResponse]
