from sqlalchemy import Column, String, DateTime, Float, Boolean, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import declarative_base # Updated import
from sqlalchemy.sql import func
import uuid

Base = declarative_base()

class CreditCardProduct(Base):
    __tablename__ = "credit_card_products"

    product_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    apr = Column(Float, nullable=False)
    annual_charges = Column(Float, nullable=False)
    credit_limit_min = Column(Float, nullable=False)
    credit_limit_max = Column(Float, nullable=False)
    rewards_description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    last_updated = Column(DateTime(timezone=True), onupdate=func.now())

class Applicant(Base):
    __tablename__ = "applicants"

    user_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone_number = Column(String, nullable=True)
    address = Column(Text, nullable=True)
    authentication_credentials = Column(String, nullable=False) # Hashed password

class CreditCardApplication(Base):
    __tablename__ = "credit_card_applications"

    application_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, nullable=False) # FK to Applicant
    product_id = Column(String, nullable=False) # FK to CreditCardProduct
    personal_info = Column(String) # Storing as String for now, consider JSONB or encrypted field
    financial_info = Column(String) # Storing as String for now, consider JSONB or encrypted field
    status = Column(String, default="Pending Review")
    submission_date = Column(DateTime(timezone=True), server_default=func.now())
    last_updated_date = Column(DateTime(timezone=True), onupdate=func.now())
    comments = Column(String) # Storing as String for now, consider JSONB
