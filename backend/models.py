from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, JSON
from sqlalchemy.orm import relationship
from .database import Base
import uuid

class CreditCard(Base):
    __tablename__ = "credit_cards"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, index=True)
    features = Column(JSON)
    benefits = Column(JSON)
    eligibility_criteria = Column(JSON)
    apr = Column(Float)
    annual_fee = Column(Float)
    issuer = Column(String)
    image_url = Column(String)

class Applicant(Base):
    __tablename__ = "applicants"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    full_name = Column(String)
    address = Column(JSON)
    phone_number = Column(String)
    email_address = Column(String, unique=True, index=True)
    credit_score = Column(Integer)
    annual_income = Column(Float)
    employer_name = Column(String)
    employer_address = Column(JSON)
    job_title = Column(String)
    employment_start_date = Column(Date)

    applications = relationship("Application", back_populates="applicant")

class Application(Base):
    __tablename__ = "applications"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    applicant_id = Column(String, ForeignKey("applicants.id"))
    card_id = Column(String, ForeignKey("credit_cards.id"))
    submission_date = Column(Date)
    status = Column(String)

    applicant = relationship("Applicant", back_populates="applications")
    documents = relationship("Document", back_populates="application")

class Document(Base):
    __tablename__ = "documents"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    application_id = Column(String, ForeignKey("applications.id"))
    document_type = Column(String)
    storage_path = Column(String)
    file_name = Column(String)
    upload_date = Column(Date)

    application = relationship("Application", back_populates="documents")
