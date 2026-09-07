import sys
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field

# Aliasing sys.modules to prevent duplicate module loading ('schemas' vs 'server.schemas')
if __name__ == "server.schemas":
    sys.modules["schemas"] = sys.modules["server.schemas"]
elif __name__ == "schemas":
    sys.modules["server.schemas"] = sys.modules["schemas"]


# Visitor Pre-Approval Schemas
class VisitorPreApprovalCreate(BaseModel):
    unit_number: str = Field(...)
    visitor_name: str = Field(...)
    contact_phone: str = Field(...)
    vehicle_number: Optional[str] = Field(None)
    valid_from: datetime = Field(...)
    valid_until: datetime = Field(...)


class VisitorPreApprovalResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    visitor_id: str
    id: Optional[str] = None
    unit_number: str
    visitor_name: str
    contact_phone: Optional[str] = None
    vehicle_number: Optional[str] = None
    qr_token: str
    valid_from: datetime
    valid_until: datetime
    status: str
    created_at: datetime


# QR Entry Validation Schemas
class QRValidateRequest(BaseModel):
    qr_token: str = Field(...)
    gate_id: str = Field("Main Gate")
    guard_id: Optional[str] = Field(None)


class QRValidateResponse(BaseModel):
    access_granted: bool
    visitor_name: Optional[str] = None
    unit_number: Optional[str] = None
    entry_timestamp: Optional[datetime] = None
    message: str
    error_code: Optional[str] = None
    detail: Optional[str] = None
    resident_notification_sent: bool = True


# Delivery Schemas
class DeliveryCreate(BaseModel):
    unit_number: str = Field(...)
    courier_name: str = Field(...)
    tracking_number: Optional[str] = Field(None)
    package_description: Optional[str] = Field(None)


class DeliveryCollectRequest(BaseModel):
    notes: Optional[str] = None


class DeliveryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    delivery_id: str
    id: Optional[str] = None
    unit_number: str
    courier_name: str
    tracking_number: Optional[str] = None
    package_description: Optional[str] = None
    status: str
    logged_at: datetime
    collected_at: Optional[datetime] = None
    is_overdue: bool = False
    notification_sent: bool = True
    notification_status: str = "DELIVERED_TO_RESIDENT"


# Security Alert Schemas
class SecurityAlertCreate(BaseModel):
    alert_type: str = Field(...)
    severity: str = Field("HIGH")
    location: str = Field(...)
    description: str = Field(...)


class SecurityAlertCancel(BaseModel):
    cancellation_reason: str = Field(...)


class SecurityAlertResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    alert_id: str
    id: Optional[str] = None
    alert_type: str
    severity: str
    location: str
    description: str
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    can_cancel_until: Optional[datetime] = None
    cancellation_reason: Optional[str] = None
    cancelled_by: Optional[str] = None
    cancelled_at: Optional[datetime] = None
    broadcast_status: str = "BROADCASTED_TO_GUARD_TERMINALS"
    broadcast_recipients: List[str] = Field(
        default_factory=lambda: [
            "Guard Terminal 1",
            "Guard Terminal 2",
            "Security Supervisor App",
        ]
    )
