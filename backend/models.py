from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base
import uuid

class Applicant(Base):
    __tablename__ = "applicants"

    applicant_id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, unique=True, index=True) # FK to User Service, assuming string for now
    full_name = Column(String, index=True)
    address = Column(String)
    phone_number = Column(String)
    email_address = Column(String, unique=True, index=True)
    date_of_birth = Column(Date)

    applications = relationship("Application", back_populates="applicant")

class Application(Base):
    __tablename__ = "applications"

    application_id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    applicant_id = Column(String, ForeignKey("applicants.applicant_id"))
    credit_card_product_id = Column(String) # FK to Product Catalog, assuming string for now
    submission_date = Column(Date)
    status = Column(String, default="PENDING")
    last_updated = Column(Date)

    applicant = relationship("Applicant", back_populates="applications")
    financial_info = relationship("FinancialInfo", back_populates="application", uselist=False)
    employment_info = relationship("EmploymentInfo", back_populates="application", uselist=False)

class FinancialInfo(Base):
    __tablename__ = "financial_info"

    financial_info_id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    application_id = Column(String, ForeignKey("applications.application_id"))
    annual_income = Column(Integer)
    credit_score = Column(Integer)
    account_statement_document_id = Column(String) # FK to Document Storage, assuming string for now

    application = relationship("Application", back_populates="financial_info")

class EmploymentInfo(Base):
    __tablename__ = "employment_info"

    employment_info_id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    application_id = Column(String, ForeignKey("applications.application_id"))
    employer_name = Column(String)
    employer_address = Column(String)
    job_title = Column(String)
    employment_start_date = Column(Date)

    application = relationship("Application", back_populates="employment_info")
