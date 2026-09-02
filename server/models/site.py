import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Text, DateTime
from sqlalchemy.orm import relationship
from server.database import Base


class ExcavationSite(Base):
    __tablename__ = "excavation_sites"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(150), nullable=False)
    site_code = Column(String(50), unique=True, nullable=False, index=True)
    region = Column(String(100), nullable=False)
    historical_period = Column(String(100), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    altitude_meters = Column(Float, nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    artifacts = relationship("DiscoveredArtifact", back_populates="site", cascade="all, delete-orphan")
    stratigraphic_layers = relationship(
        "StratigraphicLayer", back_populates="site", cascade="all, delete-orphan", order_by="StratigraphicLayer.depth_top_meters"
    )
    teams = relationship("ExcavationTeam", back_populates="site")
