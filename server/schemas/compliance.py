from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class ComplianceCheckRequest(BaseModel):
    amount: float
    beneficiary_name: str
    currency: str
    destination_country: str


class ComplianceCheckResponse(BaseModel):
    check_id: str
    details: Optional[str] = None
    risk_score: float
    sanction_screen_status: str
    status: str

    class Config:
        from_attributes = True


class ComplianceReportResponse(BaseModel):
    report_id: str
    generated_at: datetime
    download_url: str
