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
)
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
    interests = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)

    recommendations = relationship(
        "Recommendation", back_populates="request", cascade="all, delete-orphan"
    )


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    request_id = Column(String(36), ForeignKey("travel_requests.id"), nullable=False)
    is_fallback = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)

    request = relationship("TravelRequest", back_populates="recommendations")
    items = relationship(
        "RecommendationItem",
        back_populates="recommendation",
        cascade="all, delete-orphan",
    )
    export_logs = relationship(
        "ExportLog",
        back_populates="recommendation",
        cascade="all, delete-orphan",
    )


class RecommendationItem(Base):
    __tablename__ = "recommendation_items"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    recommendation_id = Column(
        String(36), ForeignKey("recommendations.id"), nullable=False
    )
    title = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    estimated_cost = Column(Float, nullable=False, default=0.0)
    location = Column(String(255), nullable=True)
    duration = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)

    recommendation = relationship("Recommendation", back_populates="items")


class ExportLog(Base):
    __tablename__ = "export_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    recommendation_id = Column(
        String(36), ForeignKey("recommendations.id"), nullable=False
    )
    export_format = Column(String(20), nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)

    recommendation = relationship("Recommendation", back_populates="export_logs")


class CodebaseAnalysisRun(Base):
    __tablename__ = "codebase_analysis_runs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    issue_key = Column(String(50), nullable=False)
    repo_url = Column(String(255), nullable=False)
    branch_name = Column(String(100), nullable=False)
    status = Column(String(20), nullable=False, default="completed")
    report_gcs_path = Column(String(255), nullable=True)
    triggered_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)
