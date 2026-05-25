
import uuid
from sqlalchemy import Column, String, Numeric, DateTime, Date, Text, JSON, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from server.db.base import Base

class FormSubmission(Base):
    __tablename__ = "form_submissions"

    submission_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_pan = Column(String(10), nullable=False, index=True)
    financial_year = Column(String(9), nullable=False)
    declared_income = Column(Numeric(15, 2), nullable=False)
    form_type = Column(String(3), nullable=False) # '15G' or '15H'
    submission_date = Column(DateTime, default=func.now())
    status = Column(String(20), nullable=False, default='PENDING')
    validity_period_start = Column(Date, nullable=True)
    validity_period_end = Column(Date, nullable=True)
    estimated_tds_saving = Column(Numeric(10, 2), nullable=True)
    digital_form_storage_ref = Column(String(255), nullable=True)
    digital_form_checksum = Column(String(64), nullable=True)
    rejection_reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    audit_logs = relationship("AuditLog", back_populates="submission")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    log_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    submission_id = Column(UUID(as_uuid=True), ForeignKey('form_submissions.submission_id'), nullable=False)
    event_type = Column(String(50), nullable=False)
    event_details = Column(JSON, nullable=True)
    timestamp = Column(DateTime, default=func.now())
    actor = Column(String(50), nullable=False)

    submission = relationship("FormSubmission", back_populates="audit_logs")
