
import uuid
from sqlalchemy import Column, Float, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from server.database import Base

class WaterUsage(Base):
    __tablename__ = "water_usage"

    usage_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=False)
    volume_gallons = Column(Float, nullable=False)
    timestamp = Column(DateTime, nullable=False, default=func.now())
