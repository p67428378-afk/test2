import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from server.database import Base


class DiscoveredArtifact(Base):
    __tablename__ = "discovered_artifacts"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    site_id = Column(String(36), ForeignKey("excavation_sites.id", ondelete="CASCADE"), nullable=False, index=True)
    artifact_code = Column(String(100), unique=True, nullable=False, index=True)
    material = Column(String(100), nullable=False)
    context_layer = Column(String(100), nullable=True)
    depth_meters = Column(Float, nullable=True)
    excavation_date = Column(String(50), nullable=True)
    finder_member_id = Column(String(36), ForeignKey("team_members.id", ondelete="SET NULL"), nullable=True)
    description = Column(Text, nullable=True)

    # 3D spatial positioning fields
    x_offset_meters = Column(Float, nullable=True)
    y_offset_meters = Column(Float, nullable=True)
    z_depth_meters = Column(Float, nullable=True)

    # QR / Barcode identification
    qr_code_identifier = Column(String(100), unique=True, nullable=True, index=True)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    site = relationship("ExcavationSite", back_populates="artifacts")
    finder = relationship("TeamMember")
    custody_transfers = relationship("CustodyTransfer", back_populates="artifact", cascade="all, delete-orphan")
    ml_results = relationship("MLClassificationResult", back_populates="artifact", cascade="all, delete-orphan")
    lab_analyses = relationship("LabAnalysis", back_populates="artifact", cascade="all, delete-orphan")
    publications = relationship("ArtifactPublication", back_populates="artifact", cascade="all, delete-orphan")
