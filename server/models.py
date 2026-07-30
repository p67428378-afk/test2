import uuid
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from server.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)  # restaurant, ngo, volunteer, admin
    address = Column(Text, nullable=False)
    phone_number = Column(String(50), nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    donations = relationship(
        "Donation", back_populates="restaurant", foreign_keys="[Donation.restaurant_id]"
    )
    requests = relationship(
        "DonationRequest", back_populates="ngo", foreign_keys="[DonationRequest.ngo_id]"
    )
    deliveries = relationship(
        "Delivery", back_populates="volunteer", foreign_keys="[Delivery.volunteer_id]"
    )


class Donation(Base):
    __tablename__ = "donations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    restaurant_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    description = Column(Text, nullable=False)
    quantity = Column(String(100), nullable=False)
    status = Column(
        String(50), nullable=False, default="available"
    )  # available, requested, in_transit, delivered, cancelled
    best_before_dt = Column(DateTime(timezone=True), nullable=False)
    food_type = Column(String(100), nullable=True)
    pickup_location = Column(Text, nullable=True)
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    restaurant = relationship(
        "User", back_populates="donations", foreign_keys=[restaurant_id]
    )
    requests = relationship(
        "DonationRequest", back_populates="donation", cascade="all, delete-orphan"
    )


class DonationRequest(Base):
    __tablename__ = "donation_requests"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    donation_id = Column(UUID(as_uuid=True), ForeignKey("donations.id"), nullable=False)
    ngo_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    status = Column(
        String(50), nullable=False, default="pending"
    )  # pending, accepted, rejected
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    donation = relationship(
        "Donation", back_populates="requests", foreign_keys=[donation_id]
    )
    ngo = relationship("User", back_populates="requests", foreign_keys=[ngo_id])
    delivery = relationship(
        "Delivery",
        back_populates="request",
        uselist=False,
        cascade="all, delete-orphan",
    )


class Delivery(Base):
    __tablename__ = "deliveries"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    request_id = Column(
        UUID(as_uuid=True), ForeignKey("donation_requests.id"), nullable=False
    )
    volunteer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    status = Column(
        String(50), nullable=False, default="assigned"
    )  # assigned, picked_up, delivered, cancelled
    pickup_at = Column(DateTime(timezone=True), nullable=True)
    delivered_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    request = relationship(
        "DonationRequest", back_populates="delivery", foreign_keys=[request_id]
    )
    volunteer = relationship(
        "User", back_populates="deliveries", foreign_keys=[volunteer_id]
    )
