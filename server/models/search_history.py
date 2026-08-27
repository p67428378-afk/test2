import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from server.database import Base


class SearchHistory(Base):
    __tablename__ = "search_history"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    search_query = Column(String(255), nullable=False)
    resolved_location_id = Column(
        String(36), ForeignKey("cached_locations.id"), nullable=True
    )
    client_ip_hash = Column(String(64), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    location = relationship("CachedLocation", backref="search_histories")
