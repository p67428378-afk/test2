import enum
import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Enum, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from server.database import Base


class BookingStatus(str, enum.Enum):
    PENDING_ASSIGNMENT = "PENDING_ASSIGNMENT"
    ASSIGNED = "ASSIGNED"
    EN_ROUTE = "EN_ROUTE"
    ARRIVED = "ARRIVED"
    DISCHARGING = "DISCHARGING"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    customer_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    operator_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    driver_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    tanker_id = Column(String(36), ForeignKey("tankers.id"), nullable=True)
    delivery_address = Column(Text, nullable=False)
    volume_liters = Column(Integer, nullable=False)
    scheduled_time = Column(DateTime, nullable=False)
    status = Column(
        Enum(BookingStatus), default=BookingStatus.PENDING_ASSIGNMENT, nullable=False
    )
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    customer = relationship(
        "User", foreign_keys=[customer_id], back_populates="customer_bookings"
    )
    operator = relationship(
        "User", foreign_keys=[operator_id], back_populates="operator_bookings"
    )
    driver = relationship(
        "User", foreign_keys=[driver_id], back_populates="driver_bookings"
    )
    tanker = relationship("Tanker", back_populates="bookings")
