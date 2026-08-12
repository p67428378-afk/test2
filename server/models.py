import uuid
from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from server.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="CUSTOMER")
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )


class Order(Base):
    __tablename__ = "orders"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    customer_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    service_type = Column(
        String(50), nullable=False
    )  # WASH_AND_FOLD, DRY_CLEANING, IRONING_ONLY
    status = Column(String(50), nullable=False, default="SCHEDULED_FOR_PICKUP")
    pickup_window_start = Column(DateTime, nullable=False)
    pickup_window_end = Column(DateTime, nullable=False)
    delivery_window_start = Column(DateTime, nullable=False)
    delivery_window_end = Column(DateTime, nullable=False)
    weight_kg = Column(Float, nullable=True)
    item_count = Column(Integer, nullable=True)
    total_amount = Column(Float, nullable=True, default=0.0)
    payment_status = Column(String(50), nullable=False, default="PENDING")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    customer = relationship("User", foreign_keys=[customer_id])
    stages = relationship(
        "GarmentStage", back_populates="order", cascade="all, delete-orphan"
    )
    routes = relationship(
        "DriverRoute", back_populates="order", cascade="all, delete-orphan"
    )
    payments = relationship(
        "Payment", back_populates="order", cascade="all, delete-orphan"
    )


class GarmentStage(Base):
    __tablename__ = "garment_stages"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id = Column(String(36), ForeignKey("orders.id"), nullable=False)
    stage = Column(
        String(50), nullable=False
    )  # RECEIVED, SORTING, WASHING, DRYING, IRONING, READY_FOR_DELIVERY, SPECIAL_PROCESSING
    notes = Column(String(500), nullable=True)
    updated_by = Column(String(36), ForeignKey("users.id"), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)

    order = relationship("Order", back_populates="stages")
    updater = relationship("User", foreign_keys=[updated_by])


class DriverRoute(Base):
    __tablename__ = "driver_routes"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    driver_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    zone = Column(String(100), nullable=False)
    sequence_order = Column(Integer, nullable=False)
    order_id = Column(String(36), ForeignKey("orders.id"), nullable=False)
    stop_type = Column(String(50), nullable=False)  # PICKUP, DELIVERY
    stop_status = Column(
        String(50), nullable=False, default="EN_ROUTE"
    )  # EN_ROUTE, PICKED_UP, DELIVERED, CUSTOMER_UNAVAILABLE
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    driver = relationship("User", foreign_keys=[driver_id])
    order = relationship("Order", back_populates="routes")


class Payment(Base):
    __tablename__ = "payments"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id = Column(String(36), ForeignKey("orders.id"), nullable=False)
    stripe_session_id = Column(String(255), nullable=True)
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="USD", nullable=False)
    status = Column(
        String(50), nullable=False, default="PENDING"
    )  # PENDING, SUCCEEDED, FAILED, PAID
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    order = relationship("Order", back_populates="payments")
