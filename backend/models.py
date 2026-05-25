import uuid
from sqlalchemy import Column, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy_utils import EmailType, URLType
from .database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Applicant(Base):
    __tablename__ = "applicants"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, index=True)
    address = Column(String)
    phone = Column(String)
    email = Column(EmailType, unique=True, index=True)
    credit_score = Column(Float)
    annual_income = Column(Float)
    account_statement_ref = Column(URLType)

    employment = relationship("Employment", back_populates="applicant")
    application = relationship("Application", back_populates="applicant")

class Employment(Base):
    __tablename__ = "employments"

    id = Column(String, primary_key=True, default=generate_uuid)
    employer_name = Column(String)
    employer_address = Column(String)
    job_title = Column(String)
    employment_start_date = Column(Date)
    applicant_id = Column(String, ForeignKey("applicants.id"))

    applicant = relationship("Applicant", back_populates="employment")

class CreditCardOffer(Base):
    __tablename__ = "credit_card_offers"

    id = Column(String, primary_key=True, default=generate_uuid)
    card_name = Column(String, unique=True, index=True)
    features = Column(String)
    benefits = Column(String)
    eligibility_criteria = Column(String)

    applications = relationship("Application", back_populates="offer")

class Application(Base):
    __tablename__ = "applications"

    id = Column(String, primary_key=True, default=generate_uuid)
    submission_date = Column(Date)
    status = Column(String, default="Pending")
    applicant_id = Column(String, ForeignKey("applicants.id"))
    offer_id = Column(String, ForeignKey("credit_card_offers.id"))

    applicant = relationship("Applicant", back_populates="application")
    offer = relationship("CreditCardOffer", back_populates="applications")
