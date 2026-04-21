
from sqlalchemy import Column, Integer, String, Float, JSON, DateTime
from sqlalchemy.sql import func
from .database import Base
import uuid

class LoanApplicant(Base):
    __tablename__ = "loan_applicants"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    credit_score = Column(Integer)
    annual_income = Column(Float)
    monthly_debts = Column(Float)
    eligibility_status = Column(String)
    interest_rate = Column(Float, nullable=True)
    ineligibility_reasons = Column(JSON, nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
