import uuid
from sqlalchemy import Column, String, Text, Integer, Date, TIMESTAMP, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from server.database import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    preferences = Column(JSON, nullable=True)
    created_at = Column(TIMESTAMP, default=datetime.datetime.utcnow, nullable=False)
    updated_at = Column(TIMESTAMP, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False)

    watch_history = relationship("WatchHistory", back_populates="user")

class Movie(Base):
    __tablename__ = "movies"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tmdb_id = Column(Integer, unique=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    release_date = Column(Date, nullable=True)
    poster_url = Column(String, nullable=True)
    created_at = Column(TIMESTAMP, default=datetime.datetime.utcnow, nullable=False)
    updated_at = Column(TIMESTAMP, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False)

    watch_history = relationship("WatchHistory", back_populates="movie")

class WatchHistory(Base):
    __tablename__ = "watch_history"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    movie_id = Column(UUID(as_uuid=True), ForeignKey("movies.id"), nullable=False)
    watched_on = Column(Date, nullable=False)
    rating = Column(Integer, nullable=True)
    created_at = Column(TIMESTAMP, default=datetime.datetime.utcnow, nullable=False)
    updated_at = Column(TIMESTAMP, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="watch_history")
    movie = relationship("Movie", back_populates="watch_history")
