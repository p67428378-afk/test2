import uuid
from pydantic import BaseModel
from datetime import datetime
from .models import PurposeEnum, StatusEnum

class CertificateRequestBase(BaseModel):
    accountNumber: str
    purpose: PurposeEnum

class CertificateRequestCreate(CertificateRequestBase):
    pass

class CertificateRequest(CertificateRequestBase):
    requestId: uuid.UUID
    requestTimestamp: datetime
    status: StatusEnum
    generatedPdfPath: str | None = None

    class Config:
        from_attributes = True
