import uuid
from sqlalchemy import Column, Float, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Policy(Base):
    __tablename__ = "policies"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    policy_holder_id = Column(UUID(as_uuid=True), nullable=False)
    vehicle_type = Column(String, nullable=False)
    vehicle_value = Column(Float, nullable=False)
    ncb_percentage = Column(Float, nullable=False)
    vehicle_multiplier = Column(Float, nullable=False)
    base_rate = Column(Float, nullable=False)
    calculated_premium = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
