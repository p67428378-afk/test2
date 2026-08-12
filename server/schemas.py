from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str | None = "CUSTOMER"


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: str
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse | None = None


class GarmentStageBase(BaseModel):
    stage: str
    notes: str | None = None


class GarmentStageCreate(GarmentStageBase):
    weight_kg: float | None = None
    item_count: int | None = None
    updated_by: str | None = None


class GarmentStageResponse(GarmentStageBase):
    id: str
    order_id: str
    updated_by: str | None = None
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)


class OrderBase(BaseModel):
    service_type: str  # WASH_AND_FOLD, DRY_CLEANING, IRONING_ONLY
    pickup_window_start: datetime
    pickup_window_end: datetime
    delivery_window_start: datetime
    delivery_window_end: datetime
    weight_kg: float | None = None
    item_count: int | None = None


class OrderCreate(OrderBase):
    customer_id: str | None = None


class OrderStageUpdate(BaseModel):
    stage: str
    notes: str | None = None
    weight_kg: float | None = None
    item_count: int | None = None
    updated_by: str | None = None


class OrderResponse(OrderBase):
    id: str
    customer_id: str
    status: str
    total_amount: float | None = 0.0
    payment_status: str
    created_at: datetime
    updated_at: datetime
    stages: list[GarmentStageResponse] = []

    model_config = ConfigDict(from_attributes=True)


class DriverRouteCreate(BaseModel):
    driver_id: str
    zone: str
    sequence_order: int
    order_id: str
    stop_type: str  # PICKUP, DELIVERY


class DriverStopUpdate(BaseModel):
    stop_status: str  # EN_ROUTE, PICKED_UP, DELIVERED, CUSTOMER_UNAVAILABLE


class DriverRouteResponse(BaseModel):
    id: str
    driver_id: str
    zone: str
    sequence_order: int
    order_id: str
    stop_type: str
    stop_status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CheckoutSessionCreate(BaseModel):
    order_id: str
    amount: float | None = None
    currency: str | None = "USD"


class CheckoutSessionResponse(BaseModel):
    checkout_url: str
    stripe_session_id: str
    order_id: str
    amount: float
    status: str


class PaymentResponse(BaseModel):
    id: str
    order_id: str
    stripe_session_id: str | None = None
    amount: float
    currency: str
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
