import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.orm import relationship
from server.app.database import Base


class Film(Base):
    __tablename__ = "films"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, index=True, nullable=False)
    release_year = Column(Integer, nullable=False)
    genre = Column(String, nullable=False)
    poster_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    watchlist_entries = relationship(
        "WatchlistEntry", back_populates="film", cascade="all, delete-orphan"
    )
    ratings = relationship(
        "RatingEntry", back_populates="film", cascade="all, delete-orphan"
    )
