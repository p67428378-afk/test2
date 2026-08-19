import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Text, DateTime, CheckConstraint, Index
from server.database import Base


class MaintenanceEvent(Base):
    __tablename__ = "maintenance_events"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(255), nullable=False)
    event_date = Column(DateTime(timezone=True), nullable=False, index=True)
    location = Column(String(255), nullable=False, index=True)
    maintenance_type = Column(String(100), nullable=False, index=True)
    vendor_technician = Column(String(255), nullable=False)
    cost = Column(Float, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )
    updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    __table_args__ = (
        CheckConstraint("cost >= 0.0", name="chk_maint_cost_non_negative"),
        Index("idx_maint_date_loc_type", "event_date", "location", "maintenance_type"),
    )
