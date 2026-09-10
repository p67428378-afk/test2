import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, Float, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from server.database import Base


def utc_now():
    return datetime.now(timezone.utc)


class Category(Base):
    __tablename__ = "categories"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False, unique=True)
    slug = Column(String(100), nullable=False, unique=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    places = relationship(
        "TouristPlace", back_populates="category", cascade="all, delete-orphan"
    )


class TouristPlace(Base):
    __tablename__ = "tourist_places"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    category_id = Column(
        String(36), ForeignKey("categories.id", ondelete="CASCADE"), nullable=False
    )
    title = Column(String(200), nullable=False)
    summary = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    district = Column(String(100), nullable=False)
    state_region = Column(String(100), default="Kerala")
    cover_image_url = Column(Text, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    best_time_to_visit = Column(String(100), nullable=True)
    operating_hours = Column(String(100), nullable=True)
    entry_fee = Column(Float, default=0.0)
    permit_requirements = Column(Text, nullable=True)
    avg_rating = Column(Float, default=0.0)
    review_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    category = relationship("Category", back_populates="places")
    media_assets = relationship(
        "MediaAsset", back_populates="place", cascade="all, delete-orphan"
    )
    reviews = relationship(
        "Review", back_populates="place", cascade="all, delete-orphan"
    )


class MediaAsset(Base):
    __tablename__ = "media_assets"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    place_id = Column(
        String(36), ForeignKey("tourist_places.id", ondelete="CASCADE"), nullable=False
    )
    media_type = Column(String(50), default="image")
    url = Column(Text, nullable=False)
    caption = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    place = relationship("TouristPlace", back_populates="media_assets")


class Review(Base):
    __tablename__ = "reviews"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    place_id = Column(
        String(36), ForeignKey("tourist_places.id", ondelete="CASCADE"), nullable=False
    )
    user_name = Column(String(100), nullable=False)
    rating = Column(Integer, nullable=False)
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    place = relationship("TouristPlace", back_populates="reviews")
