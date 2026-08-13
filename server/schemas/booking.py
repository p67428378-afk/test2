from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, field_validator
from server.models.booking import BookingStatus
from server.schemas.user import UserResponse
from server.schemas.tanker import TankerResponse

SUPPORTED_VOLUMES = [1000, 5000, 10000]


class BookingCreate(BaseModel):
    delivery_address: str = Field(..., min_length=3)
    volume_liters: int = Field(..., description="Supported volumes: 1000, 5000, 10000")
    scheduled_time: datetime

    @field_validator("volume_liters")
    @classmethod
    def validate_volume(cls, v: int) -> int:
        if v not in SUPPORTED_VOLUMES:
            raise ValueError(
                f"Unsupported volume size {v}L. Allowed volumes: {SUPPORTED_VOLUMES}"
            )
        return v


class BookingResponse(BaseModel):
    id: str
    customer_id: str
    operator_id: Optional[str] = None
    driver_id: Optional[str] = None
    tanker_id: Optional[str] = None
    delivery_address: str
    volume_liters: int
    scheduled_time: datetime
    status: BookingStatus
    created_at: datetime
    updated_at: datetime

    customer: Optional[UserResponse] = None
    operator: Optional[UserResponse] = None
    driver: Optional[UserResponse] = None
    tanker: Optional[TankerResponse] = None

    class Config:
        from_attributes = True


class DispatchAssignRequest(BaseModel):
    booking_id: str
    driver_id: str
    tanker_id: str


class DeliveryStatusUpdateRequest(BaseModel):
    status: BookingStatus
