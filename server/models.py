"""SQLAlchemy database models for Product Recommendation System."""

import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    JSON,
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship

from server.database import Base


def generate_uuid() -> str:
    """Generate a UUID4 hex string."""
    return str(uuid.uuid4())


def utc_now() -> datetime:
    """Return current UTC timestamp."""
    return datetime.now(timezone.utc)


class Product(Base):
    """Product catalog item model."""

    __tablename__ = "products"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    category = Column(String(100), nullable=False, index=True)
    price = Column(Float, nullable=False, index=True)
    rating = Column(Float, default=0.0, index=True)
    tags = Column(JSON, default=list)
    in_stock = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    recommendations = relationship(
        "Recommendation", back_populates="product", cascade="all, delete-orphan"
    )
    saved_items = relationship(
        "SavedRecommendation", back_populates="product", cascade="all, delete-orphan"
    )


class UserPreference(Base):
    """User preferences profile for category, price, and tag recommendations."""

    __tablename__ = "user_preferences"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(255), nullable=False, index=True)
    category_preferences = Column(JSON, default=list, nullable=False)
    min_price = Column(Float, default=0.0, nullable=False)
    max_price = Column(Float, default=10000.0, nullable=False)
    preferred_tags = Column(JSON, default=list, nullable=False)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)


class Recommendation(Base):
    """Generated recommendation item associated with a session and user."""

    __tablename__ = "recommendations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(255), nullable=False, index=True)
    product_id = Column(
        String(36), ForeignKey("products.id", ondelete="CASCADE"), nullable=False
    )
    match_score = Column(Float, nullable=False)
    recommendation_type = Column(String(50), default="ai_vector")
    session_id = Column(String(255), nullable=True, index=True)
    created_at = Column(DateTime, default=utc_now)

    product = relationship("Product", back_populates="recommendations")
    feedbacks = relationship(
        "RecommendationFeedback",
        back_populates="recommendation",
        cascade="all, delete-orphan",
    )


class RecommendationFeedback(Base):
    """User feedback (like/dislike) on a specific recommendation."""

    __tablename__ = "recommendation_feedbacks"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    recommendation_id = Column(
        String(36),
        ForeignKey("recommendations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    user_id = Column(String(255), nullable=False, index=True)
    feedback = Column(String(20), nullable=False)  # "like" or "dislike"
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    recommendation = relationship("Recommendation", back_populates="feedbacks")


class SavedRecommendation(Base):
    """Bookmarked / saved product recommendation for a user."""

    __tablename__ = "saved_recommendations"
    __table_args__ = (
        UniqueConstraint("user_id", "product_id", name="uq_user_product_saved"),
    )

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(255), nullable=False, index=True)
    product_id = Column(
        String(36), ForeignKey("products.id", ondelete="CASCADE"), nullable=False
    )
    recommendation_id = Column(
        String(36), ForeignKey("recommendations.id", ondelete="SET NULL"), nullable=True
    )
    created_at = Column(DateTime, default=utc_now)

    product = relationship("Product", back_populates="saved_items")
