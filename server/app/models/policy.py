import uuid
from sqlalchemy import Column, Float, DateTime
from sqlalchemy.dialects.postgresql import UUID
from app.db.base_class import Base
import datetime

class Policy(Base):
    __tablename__ = "policy"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    base_rate = Column(Float, nullable=False)
    ncb_percentage = Column(Float, nullable=False)
    vehicle_multiplier = Column(Float, nullable=False)
    final_premium = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
