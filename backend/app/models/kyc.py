import uuid
from sqlalchemy import Column, String, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base
import enum

class KycStatus(enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    FLAGGED = "FLAGGED"

class DocumentType(enum.Enum):
    AADHAAR = "AADHAAR"
    PAN = "PAN"

class Customer(Base):
    __tablename__ = "customers"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    full_name = Column(String, index=True)
    status = Column(Enum(KycStatus), default=KycStatus.PENDING)
    created_at = Column(DateTime, default=uuid.uuid4)

    documents = relationship("Document", back_populates="owner")
    audit_trails = relationship("AuditTrail", back_populates="customer")

class Document(Base):
    __tablename__ = "documents"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    document_type = Column(Enum(DocumentType))
    document_number = Column(String, unique=True, index=True)
    is_validated = Column(String, default=False)
    owner_id = Column(String, ForeignKey("customers.id"))

    owner = relationship("Customer", back_populates="documents")

class AuditTrail(Base):
    __tablename__ = "audit_trails"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    customer_id = Column(String, ForeignKey("customers.id"))
    activity = Column(String)
    timestamp = Column(DateTime, default=uuid.uuid4)

    customer = relationship("Customer", back_populates="audit_trails")
