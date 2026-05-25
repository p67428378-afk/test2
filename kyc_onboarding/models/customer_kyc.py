
import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Enum
from kyc_onboarding.db.database import Base

class CustomerKYC(Base):
    __tablename__ = "customer_kyc"

    kyc_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    customer_id = Column(String, index=True, nullable=False)
    aadhaar_number = Column(String, nullable=False) # Encrypted in production
    pan_number = Column(String, nullable=False)     # Encrypted in production
    aadhaar_validation_status = Column(Enum('PENDING', 'VALID', 'INVALID', name='aadhaar_status'), default='PENDING', nullable=False)
    pan_validation_status = Column(Enum('PENDING', 'VALID', 'INVALID', name='pan_status'), default='PENDING', nullable=False)
    sanctions_screening_status = Column(Enum('PENDING', 'NO_MATCH', 'MATCH_FOUND', name='sanctions_status'), default='PENDING', nullable=False)
    final_kyc_status = Column(Enum('PENDING', 'APPROVED', 'FLAGGED', name='kyc_status'), default='PENDING', nullable=False)
    flagging_reason = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    last_screened_at = Column(DateTime, nullable=True)

    def __repr__(self):
        return f"<CustomerKYC(kyc_id='{self.kyc_id}', customer_id='{self.customer_id}', final_kyc_status='{self.final_kyc_status}')>"
