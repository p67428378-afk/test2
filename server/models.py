from sqlalchemy import Column, Float, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from server.database import Base

class Policy(Base):
    __tablename__ = "policies"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    base_premium = Column(Float, nullable=False)
    ncb_percentage = Column(Float, nullable=False)
    vehicle_multiplier = Column(Float, nullable=False)
    final_premium = Column(Float, nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
