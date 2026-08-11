from sqlalchemy import Column, Integer, String, DECIMAL, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import uuid

class Customer(Base):
    __tablename__ = "customers"

    customer_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    phone_number = Column(String)
    address = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    policies = relationship("Policy", back_populates="customer")

class Vehicle(Base):
    __tablename__ = "vehicles"

    vehicle_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    make = Column(String, index=True)
    model = Column(String, index=True)
    year = Column(Integer)
    vin = Column(String, unique=True, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    policies = relationship("Policy", back_populates="vehicle")

class Policy(Base):
    __tablename__ = "policies"

    policy_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    customer_id = Column(String, ForeignKey("customers.customer_id"))
    vehicle_id = Column(String, ForeignKey("vehicles.vehicle_id"))
    base_rate = Column(DECIMAL(10, 2))
    ncb_percentage = Column(DECIMAL(5, 2))
    vehicle_multiplier = Column(DECIMAL(5, 2))
    calculated_premium = Column(DECIMAL(10, 2))
    currency = Column(String, default="USD")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    customer = relationship("Customer", back_populates="policies")
    vehicle = relationship("Vehicle", back_populates="policies")
