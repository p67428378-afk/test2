import uuid
from sqlalchemy import Column, String, Integer, Float, Date, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from backend.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)

    applicants = relationship("Applicant", back_populates="user")

class Applicant(Base):
    __tablename__ = "applicants"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    full_name = Column(String, index=True)
    phone_number = Column(String)
    email = Column(String, unique=True, index=True)
    credit_score = Column(Integer)
    annual_income = Column(Float)
    mailing_address = Column(String)
    employer_name = Column(String)
    job_title = Column(String)
    employment_start_date = Column(Date)
    employer_address = Column(String)

    user = relationship("User", back_populates="applicants")
    applications = relationship("Application", back_populates="applicant")

class CreditCard(Base):
    __tablename__ = "credit_cards"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, unique=True, index=True)
    description = Column(String)
    apr = Column(Float)
    cashback_rate = Column(Float)
    annual_fee = Column(Float)
    features = Column(String)  # Comma-separated string or JSON string
    credit_limit = Column(Float)

    applications = relationship("Application", back_populates="credit_card")

class Application(Base):
    __tablename__ = "applications"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    applicant_id = Column(String, ForeignKey("applicants.id"))
    credit_card_id = Column(String, ForeignKey("credit_cards.id"))
    status = Column(String, default="Pending") # e.g., Pending, In Review, Approved, Denied
    submission_date = Column(Date)
    last_updated_date = Column(Date)
    denial_reason = Column(String, nullable=True)

    applicant = relationship("Applicant", back_populates="applications")
    credit_card = relationship("CreditCard", back_populates="applications")
