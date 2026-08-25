import uuid
from datetime import datetime
from sqlalchemy import (
    Column,
    String,
    Integer,
    DateTime,
    ForeignKey,
    UniqueConstraint,
    CheckConstraint,
)
from sqlalchemy.orm import relationship
from server.app.database import Base


class RatingEntry(Base):
    __tablename__ = "ratings"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    film_id = Column(String, ForeignKey("films.id", ondelete="CASCADE"), nullable=False)
    rating = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="ratings")
    film = relationship("Film", back_populates="ratings")

    __table_args__ = (
        UniqueConstraint("user_id", "film_id", name="uq_user_film_rating"),
        CheckConstraint("rating >= 1 AND rating <= 5", name="chk_rating_range"),
    )
