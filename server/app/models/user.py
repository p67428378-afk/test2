import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime
from sqlalchemy.orm import relationship
from server.app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    watchlist = relationship(
        "WatchlistEntry", back_populates="user", cascade="all, delete-orphan"
    )
    ratings = relationship(
        "RatingEntry", back_populates="user", cascade="all, delete-orphan"
    )
