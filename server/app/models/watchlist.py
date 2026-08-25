import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from server.app.database import Base


class WatchlistEntry(Base):
    __tablename__ = "watchlist"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    film_id = Column(String, ForeignKey("films.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="watchlist")
    film = relationship("Film", back_populates="watchlist_entries")

    __table_args__ = (
        UniqueConstraint("user_id", "film_id", name="uq_user_film_watchlist"),
    )
