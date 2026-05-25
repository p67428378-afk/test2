from sqlalchemy import Column, Integer, String, Date, ForeignKey, Text
from sqlalchemy.orm import relationship
from backend.app.db.database import Base
import uuid

class Applicant(Base):
    __tablename__ = "applicants"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    full_name = Column(String, index=True)
    address = Column(String)
    phone_number = Column(String)
    email_address = Column(String, unique=True, index=True)

    applications = relationship("Application", back_populates="applicant")

class CreditCardProduct(Base):
    __tablename__ = "credit_card_products"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, unique=True, index=True)
    description = Column(Text)
    features = Column(Text)
    eligibility_criteria = Column(Text)

    applications = relationship("Application", back_populates="credit_card_product")

class Application(Base):
    __tablename__ = "applications"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    applicant_id = Column(String, ForeignKey("applicants.id"))
    credit_card_product_id = Column(String, ForeignKey("credit_card_products.id"))
    status = Column(String, default="Pending")
    submission_date = Column(Date)
    reference_number = Column(String, unique=True, index=True, default=lambda: str(uuid.uuid4()))

    applicant = relationship("Applicant", back_populates="applications")
    credit_card_product = relationship("CreditCardProduct", back_populates="applications")
    financial_info = relationship("FinancialInformation", back_populates="application", uselist=False)
    employment_info = relationship("EmploymentInformation", back_populates="application", uselist=False)

class FinancialInformation(Base):
    __tablename__ = "financial_information"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    application_id = Column(String, ForeignKey("applications.id"))
    account_statement_reference = Column(String) # e.g., Cloud Storage URL
    credit_score = Column(Integer)
    annual_income = Column(Integer)

    application = relationship("Application", back_populates="financial_info")

class EmploymentInformation(Base):
    __tablename__ = "employment_information"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    application_id = Column(String, ForeignKey("applications.id"))
    employer_name = Column(String)
    employer_address = Column(String)
    job_title = Column(String)
    employment_start_date = Column(Date)

    application = relationship("Application", back_populates="employment_info")
