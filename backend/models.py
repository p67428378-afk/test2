
from sqlalchemy import create_engine, Column, String, Float, Integer, DateTime, ForeignKey, UUID
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.ext.declarative import declarative_base
import uuid
from datetime import datetime

Base = declarative_base()

class LoanApplication(Base):
    __tablename__ = 'loan_applications'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    applicant_id = Column(UUID(as_uuid=True), ForeignKey('applicants.id'))
    application_date = Column(DateTime, default=datetime.utcnow)
    status = Column(String(255), nullable=False)
    loan_amount = Column(Float, nullable=False)
    loan_term = Column(Integer, nullable=False)
    ease_of_approval_score = Column(Float)
    suggested_action = Column(String(255))
    justification = Column(String)
    last_reviewed_by = Column(UUID(as_uuid=True), ForeignKey('bank_representatives.id'))
    last_reviewed_date = Column(DateTime)
    applicant = relationship("Applicant")
    reviewer = relationship("BankRepresentative")

class Applicant(Base):
    __tablename__ = 'applicants'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    contact_info = Column(String)
    financial_history_ref = Column(String)
    credit_score_ref = Column(String)
    document_ref = Column(String)

class BankRepresentative(Base):
    __tablename__ = 'bank_representatives'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String(255), nullable=False, unique=True)
    name = Column(String(255), nullable=False)
    role = Column(String(255))
