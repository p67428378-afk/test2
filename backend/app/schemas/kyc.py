from __future__ import annotations
from pydantic import BaseModel
from typing import List, Optional
import datetime
import enum

class KycStatus(enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    FLAGGED = "FLAGGED"

class DocumentType(enum.Enum):
    AADHAAR = "AADHAAR"
    PAN = "PAN"

class DocumentBase(BaseModel):
    document_type: DocumentType
    document_number: str

class DocumentCreate(DocumentBase):
    pass

class Document(DocumentBase):
    id: str
    is_validated: bool
    owner_id: str

    class Config:
        from_attributes = True

class AuditTrailBase(BaseModel):
    activity: str

class AuditTrailCreate(AuditTrailBase):
    pass

class AuditTrail(AuditTrailBase):
    id: str
    timestamp: datetime.datetime
    customer_id: str

    class Config:
        from_attributes = True

class CustomerBase(BaseModel):
    full_name: str

class CustomerCreate(CustomerBase):
    documents: List[DocumentCreate]

class Customer(CustomerBase):
    id: str
    status: KycStatus
    created_at: datetime.datetime
    documents: List[Document] = []
    audit_trails: List[AuditTrail] = []

    class Config:
        from_attributes = True

class KycRequest(BaseModel):
    full_name: str
    aadhaar_number: str
    pan_number: str

class KycResponse(BaseModel):
    customer_id: str
    status: KycStatus
    message: str

Customer.model_rebuild()
