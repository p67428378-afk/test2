import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from server.database import Base


def get_utc_now():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="customer")
    created_at = Column(DateTime, nullable=False, default=get_utc_now)
    updated_at = Column(
        DateTime, nullable=False, default=get_utc_now, onupdate=get_utc_now
    )

    shipments = relationship("Shipment", back_populates="user")


class DeliveryAgent(Base):
    __tablename__ = "delivery_agents"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    full_name = Column(String(255), nullable=False)
    phone_number = Column(String(50), nullable=False)
    status = Column(String(50), nullable=False, default="active")
    created_at = Column(DateTime, nullable=False, default=get_utc_now)
    updated_at = Column(
        DateTime, nullable=False, default=get_utc_now, onupdate=get_utc_now
    )

    shipments = relationship("Shipment", back_populates="agent")


class Shipment(Base):
    __tablename__ = "shipments"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    tracking_id = Column(String(100), unique=True, nullable=False)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    agent_id = Column(String(36), ForeignKey("delivery_agents.id"), nullable=True)
    sender_details = Column(JSON, nullable=False)
    recipient_details = Column(JSON, nullable=False)
    package_details = Column(JSON, nullable=False)
    status = Column(String(50), nullable=False, default="booked")
    created_at = Column(DateTime, nullable=False, default=get_utc_now)
    updated_at = Column(
        DateTime, nullable=False, default=get_utc_now, onupdate=get_utc_now
    )

    user = relationship("User", back_populates="shipments")
    agent = relationship("DeliveryAgent", back_populates="shipments")
    tracking_history = relationship(
        "TrackingHistory", back_populates="shipment", cascade="all, delete-orphan"
    )


class TrackingHistory(Base):
    __tablename__ = "tracking_history"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    shipment_id = Column(String(36), ForeignKey("shipments.id"), nullable=False)
    status = Column(String(50), nullable=False)
    location = Column(String(255), nullable=False)
    notes = Column(String(1000), nullable=True)
    timestamp = Column(DateTime, nullable=False, default=get_utc_now)

    shipment = relationship("Shipment", back_populates="tracking_history")
