import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, Float, DateTime
from sqlalchemy.orm import relationship
from server.database import Base


class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    target_amount = Column(Float, nullable=False)
    current_amount = Column(Float, default=0.0, nullable=False)
    category = Column(String(100), index=True, nullable=False)
    status = Column(
        String(50), default="Active", nullable=False
    )  # Draft, Active, Paused, Completed, Archived
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    donations = relationship(
        "Donation", back_populates="campaign", cascade="all, delete-orphan"
    )
