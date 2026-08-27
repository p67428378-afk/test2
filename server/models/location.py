import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime
from server.database import Base


class CachedLocation(Base):
    __tablename__ = "cached_locations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False, index=True)
    region = Column(String(100), nullable=True)
    country = Column(String(100), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    zip_code = Column(String(20), nullable=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )
