import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship

from server.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class TravelRequest(Base):
    __tablename__ = "travel_requests"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    destination = Column(String(255), nullable=False)
    budget = Column(Float, nullable=False)
    currency = Column(String(10), default="USD", nullable=False)
    interests = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)

    recommendations = relationship(
        "Recommendation", back_populates="travel_request", cascade="all, delete-orphan"
    )


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    request_id = Column(
        String(36), ForeignKey("travel_requests.id", ondelete="CASCADE"), nullable=False
    )
    raw_ai_response = Column(JSON, nullable=True)
    is_fallback = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)

    travel_request = relationship("TravelRequest", back_populates="recommendations")
    items = relationship(
        "RecommendationItem",
        back_populates="recommendation",
        cascade="all, delete-orphan",
        order_by="RecommendationItem.created_at",
    )


class RecommendationItem(Base):
    __tablename__ = "recommendation_items"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    recommendation_id = Column(
        String(36), ForeignKey("recommendations.id", ondelete="CASCADE"), nullable=False
    )
    title = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    estimated_cost = Column(Float, default=0.0, nullable=False)
    location = Column(String(255), nullable=True)
    duration = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)

    recommendation = relationship("Recommendation", back_populates="items")
