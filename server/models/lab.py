import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from server.database import Base


class LabAnalysis(Base):
    __tablename__ = "lab_analyses"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    artifact_id = Column(String(36), ForeignKey("discovered_artifacts.id", ondelete="CASCADE"), nullable=False, index=True)
    test_type = Column(String(100), nullable=False)  # Radiocarbon C-14, XRF Spectrometry, Petrographic Analysis
    lab_name = Column(String(150), nullable=False)
    status = Column(String(50), default="Pending", nullable=False)  # Pending, In-Progress, Completed
    results = Column(JSON, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    artifact = relationship("DiscoveredArtifact", back_populates="lab_analyses")
