from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class CertificateRequestCreate(BaseModel):
    account_number: str = Field(..., description="The account number for the certificate")
    otp: str = Field(..., description="One-Time Password for identity verification")
    purpose: str = Field(..., description="Purpose of the certificate (e.g., visa, loan)")

class CertificateRequestResponse(BaseModel):
    id: str
    customer_id: str
    account_number: str
    purpose: str
    request_timestamp: datetime
    status: str
    failure_reason: Optional[str] = None
    generated_pdf_url: Optional[str] = None

    class Config:
        from_attributes = True

class CertificateListResponse(BaseModel):
    items: List[CertificateRequestResponse]
    page: int
    total: int
