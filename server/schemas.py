from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime, date
import uuid


# Auth Schemas
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: uuid.UUID
    email: EmailStr
    full_name: str
    role: str

    class Config:
        from_attributes = True


class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


# Certification Schemas
class CertificationBase(BaseModel):
    name: str
    issue_date: date
    expiry_date: date


class CertificationCreate(CertificationBase):
    pass


class CertificationResponse(CertificationBase):
    id: uuid.UUID

    class Config:
        from_attributes = True


# Maintenance Event Schemas
class MaintenanceEventBase(BaseModel):
    event_type: str  # 'Inspection', 'Calibration'
    scheduled_date: date
    completion_date: Optional[date] = None
    notes: Optional[str] = None


class MaintenanceEventCreate(BaseModel):
    component_id: uuid.UUID
    event_type: str
    scheduled_date: date


class MaintenanceEventResponse(MaintenanceEventBase):
    id: uuid.UUID
    component_id: uuid.UUID

    class Config:
        from_attributes = True


# Component Schemas
class ComponentBase(BaseModel):
    name: str
    description: Optional[str] = None
    location: str
    status: str = "Available"
    inventory_count: int = 0
    flagged_for_review: bool = False
    supervisor_approved: bool = False
    responsible_engineer_id: Optional[uuid.UUID] = None


class ComponentCreate(ComponentBase):
    pass


class ComponentUpdate(ComponentBase):
    pass


class ComponentListResponse(BaseModel):
    id: uuid.UUID
    name: str
    description: Optional[str] = None
    location: str
    status: str
    inventory_count: int
    next_inspection: Optional[date] = None
    next_calibration: Optional[date] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ComponentDetailResponse(ComponentBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    certifications: List[CertificationResponse] = []
    maintenance_events: List[MaintenanceEventResponse] = []

    class Config:
        from_attributes = True


# Mission Schemas
class MissionBase(BaseModel):
    name: str
    launch_date: date
    status: str = "Planning"


class MissionCreate(MissionBase):
    pass


class MissionResponse(MissionBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class MissionEquipmentAssignment(BaseModel):
    component_id: uuid.UUID


class DetailResponse(BaseModel):
    detail: str


class TriggerAlertsResponse(BaseModel):
    alerts_sent: int
    detail: str
