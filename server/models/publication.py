import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from server.database import Base


class Publication(Base):
    __tablename__ = "publications"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(255), nullable=False)
    doi = Column(String(150), unique=True, nullable=True, index=True)
    authors = Column(String(255), nullable=True)
    journal_publisher = Column(String(200), nullable=True)
    publication_date = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    artifact_links = relationship("ArtifactPublication", back_populates="publication", cascade="all, delete-orphan")


class ArtifactPublication(Base):
    __tablename__ = "artifact_publications"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    artifact_id = Column(String(36), ForeignKey("discovered_artifacts.id", ondelete="CASCADE"), nullable=False, index=True)
    publication_id = Column(String(36), ForeignKey("publications.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    artifact = relationship("DiscoveredArtifact", back_populates="publications")
    publication = relationship("Publication", back_populates="artifact_links")
