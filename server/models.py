import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from server.database import Base


def get_utc_now():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)  # donor, ngo, volunteer, admin
    name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    address = Column(String(500), nullable=True)
    created_at = Column(DateTime, nullable=False, default=get_utc_now)
    updated_at = Column(
        DateTime, nullable=False, default=get_utc_now, onupdate=get_utc_now
    )

    donations = relationship(
        "Donation", back_populates="donor", cascade="all, delete-orphan"
    )
    claims = relationship("Claim", back_populates="ngo", cascade="all, delete-orphan")
    deliveries = relationship("Delivery", back_populates="volunteer")


class Donation(Base):
    __tablename__ = "donations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    donor_id = Column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    category = Column(String(100), nullable=False)
    quantity = Column(Float, nullable=False)
    preparation_time = Column(DateTime, nullable=False)
    storage_condition = Column(
        String(100), nullable=False
    )  # Refrigerated, Heated, Ambient
    pickup_address = Column(String(500), nullable=False)
    estimated_shelf_life = Column(Integer, nullable=False)  # in hours
    freshness_status = Column(
        String(50), nullable=False, default="FRESH"
    )  # FRESH, WARNING, EXPIRED
    created_at = Column(DateTime, nullable=False, default=get_utc_now)
    updated_at = Column(
        DateTime, nullable=False, default=get_utc_now, onupdate=get_utc_now
    )

    donor = relationship("User", back_populates="donations")
    claims = relationship(
        "Claim", back_populates="donation", cascade="all, delete-orphan"
    )
    freshness_logs = relationship(
        "FreshnessLog", back_populates="donation", cascade="all, delete-orphan"
    )


class Claim(Base):
    __tablename__ = "claims"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    donation_id = Column(
        String(36), ForeignKey("donations.id", ondelete="CASCADE"), nullable=False
    )
    ngo_id = Column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    quantity = Column(Float, nullable=False)
    target_pickup_time = Column(DateTime, nullable=False)
    status = Column(
        String(50), nullable=False, default="PENDING"
    )  # PENDING, COMPLETED, CANCELLED
    created_at = Column(DateTime, nullable=False, default=get_utc_now)
    updated_at = Column(
        DateTime, nullable=False, default=get_utc_now, onupdate=get_utc_now
    )

    donation = relationship("Donation", back_populates="claims")
    ngo = relationship("User", back_populates="claims")
    deliveries = relationship(
        "Delivery", back_populates="claim", cascade="all, delete-orphan"
    )


class Delivery(Base):
    __tablename__ = "deliveries"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    claim_id = Column(
        String(36), ForeignKey("claims.id", ondelete="CASCADE"), nullable=False
    )
    volunteer_id = Column(
        String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    status = Column(
        String(50), nullable=False, default="PENDING"
    )  # PENDING, TASK_ACCEPTED, ARRIVED_AT_PICKUP, IN_TRANSIT, DELIVERED, CANCELLED
    photo_url = Column(String(500), nullable=True)
    signature = Column(String(500), nullable=True)
    created_at = Column(DateTime, nullable=False, default=get_utc_now)
    updated_at = Column(
        DateTime, nullable=False, default=get_utc_now, onupdate=get_utc_now
    )

    claim = relationship("Claim", back_populates="deliveries")
    volunteer = relationship("User", back_populates="deliveries")


class FreshnessLog(Base):
    __tablename__ = "freshness_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    donation_id = Column(
        String(36), ForeignKey("donations.id", ondelete="CASCADE"), nullable=False
    )
    old_status = Column(String(50), nullable=False)
    new_status = Column(String(50), nullable=False)
    created_at = Column(DateTime, nullable=False, default=get_utc_now)

    donation = relationship("Donation", back_populates="freshness_logs")
