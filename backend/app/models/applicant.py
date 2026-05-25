from sqlalchemy import Column, Integer, String, Date, Float
from ..database import Base
import uuid

class Applicant(Base):
    __tablename__ = "applicants"

    applicant_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    full_name = Column(String, index=True)
    ssn = Column(String)  # Encrypted
    date_of_birth = Column(Date)
    address = Column(String)
    annual_income = Column(Float)
    employment_status = Column(String)
    credit_score = Column(Integer)
    status = Column(String, default='Pending')
    credit_limit = Column(Float, nullable=True)
