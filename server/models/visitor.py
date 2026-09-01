import uuid
from datetime import datetime, timezone
import sqlalchemy.types as types
from sqlalchemy import Column, String, DateTime
from sqlalchemy.orm import relationship
from server.database import Base


class GUID(types.TypeDecorator):
    impl = types.CHAR(36)
    cache_ok = True

    def process_bind_param(self, value, dialect):
        if value is None:
            return None
        if isinstance(value, uuid.UUID):
            return str(value)
        return str(uuid.UUID(str(value)))

    def process_result_value(self, value, dialect):
        if value is None:
            return None
        if isinstance(value, uuid.UUID):
            return value
        return uuid.UUID(str(value))


class Visitor(Base):
    __tablename__ = "visitors"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    full_name = Column(String(255), nullable=False)
    national_id = Column(String(100), unique=True, index=True, nullable=False)
    email = Column(String(255), nullable=False, index=True)
    phone = Column(String(50), nullable=True)
    address = Column(String(500), nullable=True)
    photo_id_url = Column(String(1000), nullable=True)
    verification_status = Column(
        String(50), default="PENDING", nullable=False
    )  # PENDING, VERIFIED, REJECTED
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

    appointments = relationship(
        "Appointment", back_populates="visitor", cascade="all, delete-orphan"
    )
    verifications = relationship(
        "Verification", back_populates="visitor", cascade="all, delete-orphan"
    )
