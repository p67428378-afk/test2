from sqlalchemy import Column, Integer, String, Date, Float, Enum
from app.db.base import Base
import enum

class EmploymentStatus(str, enum.Enum):
    EMPLOYED = "Employed"
    SELF_EMPLOYED = "Self-Employed"
    UNEMPLOYED = "Unemployed"
    STUDENT = "Student"
    RETIRED = "Retired"

class ApplicationStatus(str, enum.Enum):
    SUBMITTED = "Submitted"
    IN_REVIEW = "In Review"
    APPROVED = "Approved"
    REJECTED = "Rejected"

class CreditApplication(Base):
    __tablename__ = "credit_applications"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    contact_information = Column(String)
    date_of_birth = Column(Date)
    address = Column(String)
    employment_status = Column(Enum(EmploymentStatus))
    annual_income = Column(Float)
    existing_credit_obligations = Column(String)
    credit_score = Column(Integer, nullable=True)
    status = Column(Enum(ApplicationStatus), default=ApplicationStatus.SUBMITTED)
    selected_credit_card_tier = Column(String, nullable=True)
