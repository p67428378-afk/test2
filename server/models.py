import uuid
from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from server.database import Base


def get_utc_now():
    return datetime.now(timezone.utc)


class City(Base):
    __tablename__ = "cities"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False, index=True)
    state = Column(String(255), nullable=True)
    country = Column(String(100), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    created_at = Column(DateTime, default=get_utc_now, nullable=False)
    updated_at = Column(
        DateTime, default=get_utc_now, onupdate=get_utc_now, nullable=False
    )

    # Relationship to search statistics
    search_statistics = relationship(
        "SearchStatistics", back_populates="city", cascade="all, delete-orphan"
    )


class SearchStatistics(Base):
    __tablename__ = "search_statistics"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    city_id = Column(
        String(36),
        ForeignKey("cities.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )
    search_count = Column(Integer, default=0, nullable=False)
    last_searched_at = Column(DateTime, default=get_utc_now, nullable=False)
    created_at = Column(DateTime, default=get_utc_now, nullable=False)
    updated_at = Column(
        DateTime, default=get_utc_now, onupdate=get_utc_now, nullable=False
    )

    # Relationship to city
    city = relationship("City", back_populates="search_statistics")
