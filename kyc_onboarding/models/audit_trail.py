
import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from kyc_onboarding.db.database import Base

class AuditTrail(Base):
    __tablename__ = "audit_trail"

    audit_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    kyc_id = Column(String, ForeignKey("customer_kyc.kyc_id"), nullable=False)
    event_timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
    actor = Column(String, nullable=False)
    action = Column(String, nullable=False)
    details = Column(JSON, nullable=True) # JSONB in PostgreSQL
    outcome = Column(String, nullable=False)
    checksum = Column(String, nullable=True) # For immutability

    customer_kyc = relationship("CustomerKYC", backref="audit_trails")

    def __repr__(self):
        return f"<AuditTrail(audit_id='{self.audit_id}', kyc_id='{self.kyc_id}', action='{self.action}')>"
