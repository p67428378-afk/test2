from sqlalchemy import Column, String, Float, DateTime
from sqlalchemy.types import JSON
from sqlalchemy.sql import func
import uuid
from .database import Base

class Policy(Base):
    __tablename__ = "policies"

    policyId = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    baseRate = Column(Float, nullable=False)
    ncbTier = Column(String, nullable=False)
    ncbDiscountPercentage = Column(Float, nullable=False)
    vehicleMultiplier = Column(Float, nullable=False)
    finalPremium = Column(Float, nullable=False)
    vehicleDetails = Column(JSON, nullable=True) # Using JSON for compatibility
    customerDetails = Column(JSON, nullable=True) # Using JSON for compatibility
    createdAt = Column(DateTime(timezone=True), server_default=func.now())
    updatedAt = Column(DateTime(timezone=True), onupdate=func.now())
