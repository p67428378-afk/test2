import uuid
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime
from sqlalchemy.sql import func
from app.db.database import Base

class LoanApplicant(Base):
    __tablename__ = "loan_applicants"

    applicant_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    credit_score = Column(Integer, nullable=False)
    annual_income = Column(Float, nullable=False)
    monthly_debts = Column(Float, nullable=False)
    eligibility_status = Column(Boolean)
    interest_rate = Column(Float)
    ineligibility_reasons = Column(String)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
