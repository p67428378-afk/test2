import uuid
from sqlalchemy import Column, String, Integer, DateTime, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from backend.database import Base

class CustomerProfile(Base):
    __tablename__ = "customer_profiles"

    customer_id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    demographics = Column(JSON, nullable=False)
    credit_history = Column(JSON, nullable=False)
    last_updated = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class TransactionPattern(Base):
    __tablename__ = "transaction_patterns"

    transaction_id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    customer_id = Column(String, index=True)
    transaction_details = Column(JSON, nullable=False)
    transaction_date = Column(DateTime(timezone=True), server_default=func.now())

class ExternalRiskSignal(Base):
    __tablename__ = "external_risk_signals"

    signal_id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    customer_id = Column(String, index=True)
    provider = Column(String, nullable=False)
    signal_type = Column(String, nullable=False)
    signal_data = Column(JSON, nullable=False)
    received_date = Column(DateTime(timezone=True), server_default=func.now())

class RiskAssessmentResult(Base):
    __tablename__ = "risk_assessment_results"

    assessment_id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    customer_id = Column(String, index=True)
    risk_score = Column(Integer, nullable=False)
    risk_status = Column(String, nullable=False)
    model_version = Column(String, nullable=False)
    assessment_timestamp = Column(DateTime(timezone=True), server_default=func.now())
    audit_log_ref = Column(String, nullable=True)

class AuditLogEntry(Base):
    __tablename__ = "audit_log_entries"

    audit_id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    assessment_id = Column(String, index=True)
    input_data_snapshot = Column(JSON, nullable=False)
    scoring_model_used = Column(String, nullable=False)
    calculated_risk_score = Column(Integer, nullable=False)
    final_risk_status = Column(String, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    regulatory_compliance_flags = Column(JSON, nullable=True)
