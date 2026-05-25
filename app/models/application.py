import uuid
from sqlalchemy import Column, String, Float, Date, Enum
from app.db.base_class import Base

class Application(Base):
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    phone_number = Column(String)
    address = Column(String)
    date_of_birth = Column(Date)
    annual_income = Column(Float)
    employment_status = Column(String)
    credit_score = Column(Float, nullable=True)
    eligibility_status = Column(String, default="Pending") # Pending, Eligible, Ineligible
    ineligibility_reason = Column(String, nullable=True)
