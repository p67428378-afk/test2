from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel
from server.schemas.compliance import ComplianceCheckResponse
from server.schemas.fraud import FraudCheckResponse
from server.schemas.audit import AuditLogResponse


class PaymentCreateRequest(BaseModel):
    amount: float
    beneficiary_account_number: str
    beneficiary_name: str
    beneficiary_routing_number: str
    destination_country: str
    rate_lock_id: str
    settlement_network: str
    source_account_id: str
    source_currency: str
    target_currency: str


class PaymentCreateResponse(BaseModel):
    compliance_status: str
    created_at: datetime
    fraud_status: str
    payment_id: str
    risk_status: str
    settlement_status: str
    status: str

    class Config:
        from_attributes = True


class PaymentListResponse(BaseModel):
    amount: float
    beneficiary_name: str
    created_at: datetime
    currency: str
    payment_id: str
    status: str

    class Config:
        from_attributes = True


class PaymentDetailResponse(BaseModel):
    amount: float
    audit_logs: List[AuditLogResponse]
    beneficiary_account_number: str
    beneficiary_name: str
    compliance_check: Optional[ComplianceCheckResponse] = None
    destination_country: str
    fee: float
    fraud_score: Optional[FraudCheckResponse] = None
    payment_id: str
    rate: float
    settlement_network: str
    source_account_id: str
    source_currency: str
    status: str
    target_currency: str

    class Config:
        from_attributes = True


class PaymentRetryResponse(BaseModel):
    details: str
    payment_id: str
    status: str
