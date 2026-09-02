import uuid
from datetime import datetime, date
from typing import Optional, List, Dict, Any
from sqlalchemy import (
    Column,
    String,
    Float,
    Integer,
    BigInteger,
    Text,
    Date,
    DateTime,
    Boolean,
    ForeignKey,
    Table,
    CheckConstraint,
    JSON,
)
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

# Association table for Many-to-Many between DiscoveredArtifact and Publication
artifact_publications = Table(
    "artifact_publications",
    Base.metadata,
    Column("artifact_id", String(36), ForeignKey("discovered_artifacts.id", ondelete="CASCADE"), primary_key=True),
    Column("publication_id", String(36), ForeignKey("publications.id", ondelete="CASCADE"), primary_key=True),
)


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, nullable=False, index=True)
    full_name = Column(String(255), nullable=True)
    role = Column(String(50), default="user", nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class ExcavationSite(Base):
    __tablename__ = "excavation_sites"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), unique=True, nullable=False, index=True)
    site_code = Column(String(100), unique=True, nullable=False, index=True)
    region = Column(String(255), nullable=False, index=True)
    historical_period = Column(String(255), nullable=False, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    altitude_meters = Column(Float, nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    __table_args__ = (
        CheckConstraint("latitude >= -90.0 AND latitude <= 90.0", name="chk_site_latitude"),
        CheckConstraint("longitude >= -180.0 AND longitude <= 180.0", name="chk_site_longitude"),
    )

    # Relationships
    artifacts = relationship("DiscoveredArtifact", back_populates="site", cascade="all, delete-orphan")
    teams = relationship("ExcavationTeam", back_populates="site")
    media_assets = relationship("MediaAsset", back_populates="site", cascade="all, delete-orphan")


class ExcavationTeam(Base):
    __tablename__ = "excavation_teams"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    team_name = Column(String(255), nullable=False, index=True)
    site_id = Column(String(36), ForeignKey("excavation_sites.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    site = relationship("ExcavationSite", back_populates="teams")
    members = relationship("TeamMember", back_populates="team", cascade="all, delete-orphan")


class TeamMember(Base):
    __tablename__ = "team_members"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    team_id = Column(String(36), ForeignKey("excavation_teams.id", ondelete="SET NULL"), nullable=True)
    full_name = Column(String(255), nullable=False, index=True)
    role = Column(String(100), nullable=False)  # Director, Archaeologist, Field Assistant, Lab Specialist
    email = Column(String(255), nullable=False, index=True)
    phone = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    team = relationship("ExcavationTeam", back_populates="members")
    discovered_artifacts = relationship("DiscoveredArtifact", back_populates="finder")


class DiscoveredArtifact(Base):
    __tablename__ = "discovered_artifacts"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    site_id = Column(String(36), ForeignKey("excavation_sites.id", ondelete="CASCADE"), nullable=False, index=True)
    artifact_code = Column(String(100), unique=True, nullable=False, index=True)
    material = Column(String(100), nullable=False, index=True)
    context_layer = Column(String(100), nullable=False)
    depth_meters = Column(Float, nullable=False)
    excavation_date = Column(Date, nullable=False, default=date.today)
    finder_member_id = Column(String(36), ForeignKey("team_members.id", ondelete="SET NULL"), nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    site = relationship("ExcavationSite", back_populates="artifacts")
    finder = relationship("TeamMember", back_populates="discovered_artifacts")
    media_assets = relationship("MediaAsset", back_populates="artifact", cascade="all, delete-orphan")
    lab_analyses = relationship("LabAnalysis", back_populates="artifact", cascade="all, delete-orphan")
    publications = relationship("Publication", secondary=artifact_publications, back_populates="artifacts")


class Publication(Base):
    __tablename__ = "publications"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(500), nullable=False, index=True)
    authors = Column(String(500), nullable=False)
    journal_publisher = Column(String(255), nullable=False)
    publication_date = Column(Date, nullable=False)
    doi = Column(String(255), nullable=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    artifacts = relationship("DiscoveredArtifact", secondary=artifact_publications, back_populates="publications")


class LabAnalysis(Base):
    __tablename__ = "lab_analyses"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    artifact_id = Column(String(36), ForeignKey("discovered_artifacts.id", ondelete="CASCADE"), nullable=False, index=True)
    test_type = Column(String(100), nullable=False, index=True)  # Radiocarbon C-14, XRF Spectrometry, Petrographic Analysis
    lab_name = Column(String(255), nullable=False)
    status = Column(String(50), default="Pending", nullable=False, index=True)  # Pending, In-Progress, Completed
    request_date = Column(Date, nullable=False, default=date.today)
    completion_date = Column(Date, nullable=True)
    result_summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    artifact = relationship("DiscoveredArtifact", back_populates="lab_analyses")
    media_assets = relationship("MediaAsset", back_populates="lab_analysis", cascade="all, delete-orphan")


class MediaAsset(Base):
    __tablename__ = "media_assets"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    site_id = Column(String(36), ForeignKey("excavation_sites.id", ondelete="SET NULL"), nullable=True, index=True)
    artifact_id = Column(String(36), ForeignKey("discovered_artifacts.id", ondelete="SET NULL"), nullable=True, index=True)
    lab_analysis_id = Column(String(36), ForeignKey("lab_analyses.id", ondelete="SET NULL"), nullable=True, index=True)
    file_name = Column(String(255), nullable=False)
    file_url = Column(String(1000), nullable=False)
    media_type = Column(String(100), nullable=False)
    file_size_bytes = Column(BigInteger, nullable=False, default=0)
    caption = Column(Text, nullable=True)
    camera_metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    site = relationship("ExcavationSite", back_populates="media_assets")
    artifact = relationship("DiscoveredArtifact", back_populates="media_assets")
    lab_analysis = relationship("LabAnalysis", back_populates="media_assets")
