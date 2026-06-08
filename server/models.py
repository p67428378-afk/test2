import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID
from server.database import Base

class CertificateRequest(Base):
    __tablename__ = "certificate_requests"

    # Use String(36) or UUID depending on DB, but to be safe and compatible with SQLite and Postgres:
    # We can use String(36) as a fallback or a custom type, or just String(36) with default=lambda: str(uuid.uuid4())
    id = Column(String(36), primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    customer_id = Column(String(255), nullable=False)
    account_number = Column(String(255), nullable=False)
    purpose = Column(String(255), nullable=False)
    request_timestamp = Column(DateTime, nullable=False, default=datetime.utcnow)
    status = Column(String(50), nullable=False)  # 'SUCCESS', 'FAILED', 'PENDING'
    failure_reason = Column(Text, nullable=True)
    generated_pdf_url = Column(String(1024), nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
