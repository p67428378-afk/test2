"""SQLAlchemy ORM models for Podcast Discovery Hub."""

import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


def get_utc_now() -> datetime:
    return datetime.now(timezone.utc)


class Podcast(Base):
    """Master record for podcast shows."""

    __tablename__ = "podcasts"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=False)
    author = Column(String(255), nullable=False)
    cover_image_url = Column(String(512), nullable=False)
    category = Column(String(100), nullable=False, index=True)
    total_subscribers = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), nullable=False, default=get_utc_now)
    updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=get_utc_now,
        onupdate=get_utc_now,
    )

    episodes = relationship(
        "Episode",
        back_populates="podcast",
        cascade="all, delete-orphan",
        order_by="desc(Episode.publish_date)",
    )


class Episode(Base):
    """Individual episodes associated with a podcast show."""

    __tablename__ = "episodes"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    podcast_id = Column(
        String(36),
        ForeignKey("podcasts.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    audio_url = Column(String(512), nullable=False)
    duration_seconds = Column(Integer, nullable=False)
    publish_date = Column(
        DateTime(timezone=True),
        nullable=False,
        default=get_utc_now,
        index=True,
    )
    episode_number = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False, default=get_utc_now)
    updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=get_utc_now,
        onupdate=get_utc_now,
    )

    podcast = relationship("Podcast", back_populates="episodes")
