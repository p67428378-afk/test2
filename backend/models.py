
from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base
import uuid

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

class Policy(Base):
    __tablename__ = "policies"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    customer_id = Column(String, ForeignKey("customers.id"))
    vehicle_id = Column(String, ForeignKey("vehicles.id"))
    base_rate = Column(Float)
    ncb_tier_id = Column(String, ForeignKey("ncb_tiers.id"))
    calculated_premium = Column(Float)
    effective_date = Column(Date)
    expiry_date = Column(Date)

    customer = relationship("Customer")
    vehicle = relationship("Vehicle")
    ncb_tier = relationship("NCBTier")

class Customer(Base):
    __tablename__ = "customers"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    first_name = Column(String)
    last_name = Column(String)
    date_of_birth = Column(Date)
    driver_license_number = Column(String, unique=True)
    address = Column(String)
    contact_number = Column(String)

class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    make = Column(String)
    model = Column(String)
    year = Column(Integer)
    vin = Column(String, unique=True)
    risk_factor = Column(Float)
    vehicle_multiplier = Column(Float)

class NCBTier(Base):
    __tablename__ = "ncb_tiers"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    years_no_claims = Column(Integer)
    discount_percentage = Column(Float)
