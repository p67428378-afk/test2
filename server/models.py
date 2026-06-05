
from sqlalchemy import Column, String, Float, TIMESTAMP, UUID
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from server.database import Base
import uuid
from datetime import datetime

class Policy(Base):
    __tablename__ = "policies"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    policy_holder_id = Column(PG_UUID(as_uuid=True), default=uuid.uuid4)
    vehicle_type = Column(String(50), nullable=False)
    vehicle_value = Column(Float, nullable=False)
    ncb_percentage = Column(Float, nullable=False)
    vehicle_multiplier = Column(Float, nullable=False)
    base_rate = Column(Float, nullable=False)
    calculated_premium = Column(Float, nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    updated_at = Column(TIMESTAMP, default=datetime.utcnow, onupdate=datetime.utcnow)
