import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from server.database import Base


class MLClassificationResult(Base):
    __tablename__ = "ml_classification_results"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    artifact_id = Column(String(36), ForeignKey("discovered_artifacts.id", ondelete="CASCADE"), nullable=False, index=True)
    media_id = Column(String(36), ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True)
    predicted_material = Column(String(100), nullable=False)
    confidence_score = Column(Float, nullable=False)
    anomalies_detected = Column(JSON, default=list, nullable=False)
    requires_manual_override = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    artifact = relationship("DiscoveredArtifact", back_populates="ml_results")
    media = relationship("MediaAsset")
