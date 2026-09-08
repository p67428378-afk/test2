from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field, model_validator


# --- Visitor Schemas ---
class VisitorPreApprovalCreate(BaseModel):
    unit_number: Optional[str] = "Unit 4B"
    visitor_name: str
    phone_number: Optional[str] = None
    contact_phone: Optional[str] = None
    vehicle_number: Optional[str] = None
    assigned_parking_slot: Optional[str] = None
    expected_arrival: Optional[datetime] = None
    expected_departure: Optional[datetime] = None
    valid_from: Optional[datetime] = None
    valid_until: Optional[datetime] = None

    @model_validator(mode="before")
    @classmethod
    def populate_aliases(cls, values):
        if isinstance(values, dict):
            phone = values.get("contact_phone") or values.get("phone_number") or ""
            values["contact_phone"] = phone
            values["phone_number"] = phone

            vf = values.get("valid_from") or values.get("expected_arrival")
            vu = values.get("valid_until") or values.get("expected_departure")
            values["valid_from"] = vf
            values["valid_until"] = vu
            values["expected_arrival"] = vf
            values["expected_departure"] = vu
        return values


class VisitorPreApprovalResponse(BaseModel):
    visitor_id: str
    qr_token_id: str
    qr_code_payload: str
    qr_token: str
    valid_from: datetime
    valid_until: datetime
    unit_number: Optional[str] = None
    visitor_name: str

    model_config = ConfigDict(from_attributes=True)


class QRValidateRequest(BaseModel):
    qr_token: Optional[str] = None
    qr_code_payload: Optional[str] = None
    gate_id: Optional[str] = "Main Gate"


class QRValidateResponse(BaseModel):
    access_granted: bool
    status: str
    visitor_name: str
    resident_unit: str
    entry_timestamp: datetime
    assigned_parking_slot: Optional[str] = None


class ExtendStayRequest(BaseModel):
    extension_minutes: int = Field(120, ge=1, le=240)


class ExtendStayResponse(BaseModel):
    visitor_id: str
    new_expected_departure: datetime


# --- Delivery Schemas ---
class DeliveryCreate(BaseModel):
    unit_number: str
    courier_company: Optional[str] = None
    courier_name: Optional[str] = None
    tracking_number: Optional[str] = None
    package_description: Optional[str] = None

    @model_validator(mode="before")
    @classmethod
    def populate_courier(cls, values):
        if isinstance(values, dict):
            c = values.get("courier_company") or values.get("courier_name") or "Courier"
            values["courier_company"] = c
            values["courier_name"] = c
        return values


class DeliveryResponse(BaseModel):
    id: str
    unit_number: str
    courier_company: str
    courier_name: str
    tracking_number: Optional[str] = None
    package_description: Optional[str] = None
    status: str
    logged_at: datetime
    collected_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


# --- Alert Schemas ---
class AlertCreate(BaseModel):
    severity: str
    alert_type: str
    location: Optional[str] = None
    location_tag: Optional[str] = None
    description: Optional[str] = None

    @model_validator(mode="before")
    @classmethod
    def populate_location(cls, values):
        if isinstance(values, dict):
            loc = values.get("location") or values.get("location_tag") or "Main Gate"
            values["location"] = loc
            values["location_tag"] = loc
        return values


class AlertCancel(BaseModel):
    cancel_reason: str


class AlertResponse(BaseModel):
    id: str
    severity: str
    alert_type: str
    location: str
    location_tag: str
    description: Optional[str] = None
    status: str
    cancel_reason: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


# --- Recurring Pass Schemas ---
class RecurringPassCreate(BaseModel):
    visitor_name: str
    service_type: str
    days_of_week: str
    start_date: datetime
    end_date: datetime
    access_start_time: str
    access_end_time: str


class RecurringPassResponse(BaseModel):
    id: str
    visitor_name: str
    service_type: str
    days_of_week: str
    start_date: datetime
    end_date: datetime
    access_start_time: str
    access_end_time: str
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class RecurringPassRevokeResponse(BaseModel):
    recurring_pass_id: str
    is_active: bool
    message: str


# --- Overstay & Parking Schemas ---
class OverstayResponseItem(BaseModel):
    visitor_id: str
    visitor_name: str
    vehicle_number: Optional[str] = None
    slot_number: Optional[str] = None
    entry_time: datetime
    expected_exit_time: datetime
    grace_period_expires: datetime
    overstay_status: str
