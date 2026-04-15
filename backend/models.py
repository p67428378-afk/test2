
import uuid
from sqlalchemy import Column, String, Integer, Float, Date, ForeignKey, JSON
from sqlalchemy.orm import relationship
from .database import Base

def generate_uuid():
    return str(uuid.uuid4())

class CreditCardOffering(Base):
    __tablename__ = "credit_card_offerings"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, index=True)
    description = Column(String)
    features = Column(JSON)
    benefits = Column(JSON)
    eligibility_criteria = Column(String)

class Applicant(Base):
    __tablename__ = "applicants"

    id = Column(String, primary_key=True, default=generate_uuid)
    first_name = Column(String)
    last_name = Column(String)
    address_line_1 = Column(String)
    address_line_2 = Column(String, nullable=True)
    city = Column(String)
    state = Column(String)
    zip_code = Column(String)
    phone_number = Column(String)
    email_address = Column(String, unique=True, index=True)
    application_status = Column(String, default="Draft")

    applications = relationship("Application", back_populates="applicant")

class Application(Base):
    __tablename__ = "applications"

    id = Column(String, primary_key=True, default=generate_uuid)
    applicant_id = Column(String, ForeignKey("applicants.id"))
    credit_card_id = Column(String, ForeignKey("credit_card_offerings.id"))
    submission_date = Column(Date)
    status = Column(String, default="Submitted")
    last_updated_date = Column(Date)

    applicant = relationship("Applicant", back_populates="applications")
    financial_info = relationship("FinancialInfo", uselist=False, back_populates="application")
    employment_info = relationship("EmploymentInfo", uselist=False, back_populates="application")

class FinancialInfo(Base):
    __tablename__ = "financial_info"

    id = Column(String, primary_key=True, default=generate_uuid)
    application_id = Column(String, ForeignKey("applications.id"))
    annual_income = Column(Float)
    credit_score = Column(Integer)
    account_statement_ref = Column(String)

    application = relationship("Application", back_populates="financial_info")

class EmploymentInfo(Base):
    __tablename__ = "employment_info"

    id = Column(String, primary_key=True, default=generate_uuid)
    application_id = Column(String, ForeignKey("applications.id"))
    employer_name = Column(String)
    employer_address = Column(String)
    job_title = Column(String)
    employment_start_date = Column(Date)

    application = relationship("Application", back_populates="employment_info")
