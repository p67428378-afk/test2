import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship as orm_relationship, synonym
from server.database import Base
from server.models.visitor import GUID


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    visitor_id = Column(
        GUID, ForeignKey("visitors.id", ondelete="CASCADE"), nullable=False, index=True
    )
    inmate_id = Column(
        GUID, ForeignKey("inmates.id", ondelete="CASCADE"), nullable=False, index=True
    )
    visit_date = Column(Date, nullable=False, index=True)
    start_time = Column(String(20), nullable=False)  # e.g., "10:00"
    relationship_to_inmate = Column(
        "relationship", String(100), nullable=False, default="Family"
    )
    status = Column(
        String(50), default="PENDING", nullable=False
    )  # PENDING, APPROVED, REJECTED, COMPLETED, CANCELLED
    rejection_reason = Column(String(500), nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    relationship = synonym("relationship_to_inmate")

    visitor = orm_relationship("Visitor", back_populates="appointments")
    inmate = orm_relationship("Inmate", back_populates="appointments")
    entry_exit_logs = orm_relationship(
        "EntryExitLog", back_populates="appointment", cascade="all, delete-orphan"
    )
