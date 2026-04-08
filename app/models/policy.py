import uuid
from sqlalchemy import Column, String, Integer, Float, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.database import Base

class Policy(Base):
    __tablename__ = "policies"

    policy_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = Column(String, index=True)
    vehicle_type = Column(String, index=True)
    no_claims_years = Column(Integer)
    base_rate = Column(Float)
    ncb_discount_percentage = Column(Float)
    vehicle_multiplier = Column(Float)
    calculated_premium = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
