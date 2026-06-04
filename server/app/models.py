import uuid
from sqlalchemy import Column, DateTime, Float, Integer, String, func
from sqlalchemy.dialects.postgresql import UUID as pgUUID
from server.app.database import Base

class Policy(Base):
    __tablename__ = "policies"

    policy_id = Column(pgUUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = Column(pgUUID(as_uuid=True), nullable=False)
    vehicle_make = Column(String(255), nullable=False)
    vehicle_model = Column(String(255), nullable=False)
    ncb_percentage = Column(Integer, nullable=False)
    vehicle_multiplier = Column(Float, nullable=False)
    base_premium = Column(Float, nullable=False)
    calculated_premium = Column(Float, nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
