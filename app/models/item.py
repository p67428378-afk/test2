
from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from app.db.database import Base

class Item(Base):
    __tablename__ = "items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    type = Column(String(255), nullable=False)
    material = Column(String(255), nullable=False)
    weight = Column(Float, nullable=False)
    cost = Column(Float, nullable=False)
    selling_price = Column(Float, nullable=False)
    stock_level = Column(Integer, nullable=False)
    location = Column(String(255), nullable=False)
    status = Column(String(50), default="Available")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
