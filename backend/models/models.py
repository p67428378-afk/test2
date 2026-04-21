from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from backend.database import Base

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(String, unique=True, index=True)
    mobile_number = Column(String)
    hashed_password = Column(String)

class OTP(Base):
    __tablename__ = "otps"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(String, index=True)
    otp = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
