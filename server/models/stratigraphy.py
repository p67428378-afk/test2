import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from server.database import Base


class StratigraphicLayer(Base):
    __tablename__ = "stratigraphic_layers"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    site_id = Column(String(36), ForeignKey("excavation_sites.id", ondelete="CASCADE"), nullable=False, index=True)
    layer_code = Column(String(50), nullable=False)
    historical_period = Column(String(100), nullable=False)
    depth_top_meters = Column(Float, nullable=False)
    depth_bottom_meters = Column(Float, nullable=False)
    color_hex = Column(String(7), default="#8B4513", nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    site = relationship("ExcavationSite", back_populates="stratigraphic_layers")
