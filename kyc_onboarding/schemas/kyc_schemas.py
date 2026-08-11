
from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field

class KYCRequest(BaseModel):
    customer_id: str = Field(..., example="CUST123")
    aadhaar_number: str = Field(..., example="123456789012")
    pan_number: str = Field(..., example="ABCDE1234F")

class KYCStatusResponse(BaseModel):
    kyc_id: str = Field(..., example="a1b2c3d4-e5f6-7890-1234-567890abcdef")
    customer_id: str = Field(..., example="CUST123")
    final_kyc_status: str = Field(..., example="PENDING")
    message: str = Field(..., example="KYC processing initiated.")

class AuditTrailEntry(BaseModel):
    audit_id: str
    kyc_id: str
    event_timestamp: datetime
    actor: str
    action: str
    details: Optional[Dict[str, Any]]
    outcome: str
    checksum: Optional[str]

    class Config:
        from_attributes = True

class CustomerKYCBase(BaseModel):
    customer_id: str
    aadhaar_number: str
    pan_number: str

class CustomerKYCCreate(CustomerKYCBase):
    pass

class CustomerKYCResponse(CustomerKYCBase):
    kyc_id: str
    aadhaar_validation_status: str
    pan_validation_status: str
    sanctions_screening_status: str
    final_kyc_status: str
    flagging_reason: Optional[str]
    created_at: datetime
    updated_at: datetime
    last_screened_at: Optional[datetime]
    audit_trails: list[AuditTrailEntry] = []

    class Config:
        from_attributes = True
