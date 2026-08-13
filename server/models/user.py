import enum
import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Enum, DateTime, Boolean
from sqlalchemy.orm import relationship
from server.database import Base


class UserRole(str, enum.Enum):
    CUSTOMER = "CUSTOMER"
    OPERATOR = "OPERATOR"
    DRIVER = "DRIVER"
    ADMIN = "ADMIN"


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.CUSTOMER, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    customer_bookings = relationship(
        "Booking", foreign_keys="Booking.customer_id", back_populates="customer"
    )
    operator_bookings = relationship(
        "Booking", foreign_keys="Booking.operator_id", back_populates="operator"
    )
    driver_bookings = relationship(
        "Booking", foreign_keys="Booking.driver_id", back_populates="driver"
    )
