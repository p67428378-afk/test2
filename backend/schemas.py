from typing import Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel

class CustomerProfileBase(BaseModel):
    demographics: Dict[str, Any]
    credit_history: Dict[str, Any]

class CustomerProfileCreate(CustomerProfileBase):
    pass

class CustomerProfile(CustomerProfileBase):
    customer_id: str
    last_updated: datetime

    class Config:
        from_attributes = True

class TransactionPatternBase(BaseModel):
    customer_id: str
    transaction_details: Dict[str, Any]

class TransactionPatternCreate(TransactionPatternBase):
    pass

class TransactionPattern(TransactionPatternBase):
    transaction_id: str
    transaction_date: datetime

    class Config:
        from_attributes = True

class ExternalRiskSignalBase(BaseModel):
    customer_id: str
    provider: str
    signal_type: str
    signal_data: Dict[str, Any]

class ExternalRiskSignalCreate(ExternalRiskSignalBase):
    pass

class ExternalRiskSignal(ExternalRiskSignalBase):
    signal_id: str
    received_date: datetime

    class Config:
        from_attributes = True

class RiskAssessmentResultBase(BaseModel):
    customer_id: str
    risk_score: int
    risk_status: str
    model_version: str
    audit_log_ref: Optional[str] = None

class RiskAssessmentResultCreate(RiskAssessmentResultBase):
    pass

class RiskAssessmentResult(RiskAssessmentResultBase):
    assessment_id: str
    assessment_timestamp: datetime

    class Config:
        from_attributes = True

class AuditLogEntryBase(BaseModel):
    assessment_id: str
    input_data_snapshot: Dict[str, Any]
    scoring_model_used: str
    calculated_risk_score: int
    final_risk_status: str
    regulatory_compliance_flags: Optional[Dict[str, Any]] = None

class AuditLogEntryCreate(AuditLogEntryBase):
    pass

class AuditLogEntry(AuditLogEntryBase):
    audit_id: str
    timestamp: datetime

    class Config:
        from_attributes = True

class RiskAssessmentRequest(BaseModel):
    customer_id: str
    demographics: Dict[str, Any]
    transaction_patterns: Dict[str, Any]
    credit_history: Dict[str, Any]
    external_risk_signals: Dict[str, Any]

class RiskAssessmentResponse(BaseModel):
    assessment_id: str
    customer_id: str
    risk_status: str
    risk_score: int
    model_version: str
    assessment_timestamp: datetime
    audit_log_ref: str
