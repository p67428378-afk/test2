import enum
import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Enum, DateTime
from sqlalchemy.orm import relationship
from server.database import Base


class TankerStatus(str, enum.Enum):
    AVAILABLE = "AVAILABLE"
    IN_USE = "IN_USE"
    IN_MAINTENANCE = "IN_MAINTENANCE"


class Tanker(Base):
    __tablename__ = "tankers"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    registration_number = Column(String(100), unique=True, index=True, nullable=False)
    capacity_liters = Column(Integer, nullable=False)
    status = Column(Enum(TankerStatus), default=TankerStatus.AVAILABLE, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    bookings = relationship("Booking", back_populates="tanker")
