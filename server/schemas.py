from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime


# Auth Schemas
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: Optional[str] = "customer"


class UserResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


# Shipment Schemas
class AddressDetails(BaseModel):
    name: str
    phone: str
    address: str
    city: str


class PackageDetails(BaseModel):
    weight: float
    width: float
    height: float
    length: float
    description: Optional[str] = None


class ShipmentCreate(BaseModel):
    sender_details: AddressDetails
    recipient_details: AddressDetails
    package_details: PackageDetails


class ShipmentResponse(BaseModel):
    id: str
    tracking_id: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class ShipmentListItem(BaseModel):
    id: str
    tracking_id: str
    recipient_name: str
    destination_city: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class ShipmentListResponse(BaseModel):
    items: List[ShipmentListItem]


class TrackingHistoryItem(BaseModel):
    id: str
    status: str
    location: str
    notes: Optional[str] = None
    timestamp: datetime

    class Config:
        from_attributes = True


class ShipmentTrackResponse(BaseModel):
    id: str
    tracking_id: str
    sender_name: str
    recipient_name: str
    destination_city: str
    status: str
    tracking_history: List[TrackingHistoryItem]

    class Config:
        from_attributes = True


# Agent Schemas
class AgentCreate(BaseModel):
    full_name: str
    phone_number: str


class AgentResponse(BaseModel):
    id: str
    full_name: str
    phone_number: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class AgentListItem(BaseModel):
    id: str
    full_name: str
    phone_number: str
    status: str
    active_shipments_count: int

    class Config:
        from_attributes = True


class AgentListResponse(BaseModel):
    items: List[AgentListItem]


class AgentAssignRequest(BaseModel):
    agent_id: str


class AgentAssignResponse(BaseModel):
    shipment_id: str
    agent_id: str
    status: str
    updated_at: datetime


class ShipmentStatusUpdateRequest(BaseModel):
    status: str
    location: str
    notes: Optional[str] = None


class ShipmentStatusUpdateResponse(BaseModel):
    shipment_id: str
    status: str
    updated_at: datetime
