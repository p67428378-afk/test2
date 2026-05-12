import uuid
from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from .database import Base
import datetime

class LoanApplication(Base):
    __tablename__ = "loan_applications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    applicant_id = Column(UUID(as_uuid=True), ForeignKey("applicants.id"))
    application_date = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String(255), nullable=False)
    loan_amount = Column(Float, nullable=False)
    loan_term = Column(Integer, nullable=False)
    ease_of_approval_score = Column(Float)
    suggested_action = Column(String(255))
    justification = Column(String)
    last_reviewed_by = Column(UUID(as_uuid=True), ForeignKey("bank_representatives.id"))
    last_reviewed_date = Column(DateTime)

    applicant = relationship("Applicant", back_populates="loan_applications")
    reviewer = relationship("BankRepresentative", back_populates="reviewed_applications")

class Applicant(Base):
    __tablename__ = "applicants"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    contact_info = Column(String)
    financial_history_ref = Column(String)
    credit_score_ref = Column(String)
    document_ref = Column(String)

    loan_applications = relationship("LoanApplication", back_populates="applicant")

class BankRepresentative(Base):
    __tablename__ = "bank_representatives"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String(255), nullable=False, unique=True)
    name = Column(String(255), nullable=False)
    role = Column(String(255))
    hashed_password = Column(String(255), nullable=False)

    reviewed_applications = relationship("LoanApplication", back_populates="reviewer")
