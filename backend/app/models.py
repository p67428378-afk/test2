from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

Base = declarative_base()

class CreditCardProduct(Base):
    __tablename__ = "credit_card_products"

    product_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, index=True, nullable=False)
    description = Column(String, nullable=False)
    apr = Column(Float, nullable=False)
    annual_charges = Column(Float, nullable=False)
    credit_limit_min = Column(Float, nullable=False)
    credit_limit_max = Column(Float, nullable=False)
    rewards_description = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    applications = relationship("CreditCardApplication", back_populates="product")

class Applicant(Base):
    __tablename__ = "applicants"

    user_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone_number = Column(String, nullable=False)
    address = Column(JSON, nullable=False)  # Storing address as JSON
    authentication_credentials = Column(String, nullable=False) # Hashed password or similar

    applications = relationship("CreditCardApplication", back_populates="applicant")

class CreditCardApplication(Base):
    __tablename__ = "credit_card_applications"

    application_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("applicants.user_id"), nullable=False)
    product_id = Column(String, ForeignKey("credit_card_products.product_id"), nullable=False)
    personal_info = Column(JSON, nullable=False)  # Encrypted/JSONB
    financial_info = Column(JSON, nullable=False)  # Encrypted/JSONB
    status = Column(String, default="Pending Review", nullable=False) # e.g., 'Pending Review', 'Approved', 'Declined', 'More Info Required'
    submission_date = Column(DateTime, default=datetime.utcnow)
    last_updated_date = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    comments = Column(JSON) # JSONB for comments/notes

    applicant = relationship("Applicant", back_populates="applications")
    product = relationship("CreditCardProduct", back_populates="applications")
