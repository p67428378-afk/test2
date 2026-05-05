from sqlalchemy import Column, Integer, String, Float, Date
from app.db.base import Base

class InterestCertificate(Base):
    __tablename__ = "interest_certificates"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(String, index=True)
    financial_year = Column(String)
    savings_interest = Column(Float)
    fd_interest = Column(Float)
    total_interest = Column(Float)
    tds_deducted = Column(Float)
    net_interest = Column(Float)
    generation_date = Column(Date)
