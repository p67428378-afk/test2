from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field


# Visitor Pre-Approval Schemas
class VisitorPreApprovalCreate(BaseModel):
    unit_number: str = Field(..., example="Unit 4B")
    visitor_name: str = Field(..., example="Bob Smith")
    contact_phone: str = Field(..., example="+15550192834")
    vehicle_number: Optional[str] = Field(None, example="XYZ-9876")
    valid_from: datetime = Field(..., example="2026-06-01T14:00:00Z")
    valid_until: datetime = Field(..., example="2026-06-01T18:00:00Z")


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
    qr_token: str = Field(..., example="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    gate_id: str = Field("Main Gate", example="Main Gate")
    guard_id: Optional[str] = Field(
        None, example="b4cc290f-9cf0-4999-aa23-432123456789"
    )


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
    unit_number: str = Field(..., example="Unit 4B")
    courier_name: str = Field(..., example="FedEx")
    tracking_number: Optional[str] = Field(None, example="FX-99201123")
    package_description: Optional[str] = Field(None, example="Small box")


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
    alert_type: str = Field(..., example="UNAUTHORIZED_ENTRY")
    severity: str = Field("HIGH", example="HIGH")
    location: str = Field(..., example="North Gate")
    description: str = Field(
        ..., example="Vehicle bypassed barrier without valid QR code"
    )


class SecurityAlertCancel(BaseModel):
    cancellation_reason: str = Field(
        ..., example="Accidental trigger during guard shift handoff"
    )


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
