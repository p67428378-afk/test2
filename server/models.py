import uuid
from datetime import datetime

from sqlalchemy import (
    JSON,
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    String,
    Text,
)
from sqlalchemy.orm import relationship

from server.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class Product(Base):
    __tablename__ = "products"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(100), nullable=False, index=True)
    price = Column(Float, nullable=False)
    rating = Column(Float, default=0.0)
    tags = Column(JSON, default=list)
    in_stock = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    recommendations = relationship(
        "Recommendation", back_populates="product", cascade="all, delete-orphan"
    )


class UserPreference(Base):
    __tablename__ = "user_preferences"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(255), nullable=False, unique=True, index=True)
    category_preferences = Column(JSON, default=list)
    min_price = Column(Float, nullable=False, default=0.0)
    max_price = Column(Float, nullable=False, default=1000.0)
    preferred_tags = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(255), nullable=False, index=True)
    product_id = Column(String(36), ForeignKey("products.id"), nullable=False)
    match_score = Column(Float, nullable=False)
    recommendation_type = Column(String(50), default="ai_vector")
    created_at = Column(DateTime, default=datetime.utcnow)

    product = relationship("Product", back_populates="recommendations")
    feedbacks = relationship(
        "RecommendationFeedback",
        back_populates="recommendation",
        cascade="all, delete-orphan",
    )


class RecommendationFeedback(Base):
    __tablename__ = "recommendation_feedbacks"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    recommendation_id = Column(
        String(36), ForeignKey("recommendations.id"), nullable=False, index=True
    )
    user_id = Column(String(255), nullable=False, index=True)
    feedback = Column(String(20), nullable=False)  # 'like' | 'dislike'
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    recommendation = relationship("Recommendation", back_populates="feedbacks")
