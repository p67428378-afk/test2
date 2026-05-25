import uuid
from sqlalchemy import Column, String, Float, Date, ForeignKey, Integer
from sqlalchemy.orm import relationship
from backend.app.database import Base

class Policy(Base):
    __tablename__ = "policies"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    customer_id = Column(String, ForeignKey("drivers.id"))
    vehicle_id = Column(String, ForeignKey("vehicles.id"))
    premium_amount = Column(Float)
    start_date = Column(Date)
    end_date = Column(Date)
    applied_ncb = Column(Float)
    applied_multiplier = Column(Float)

    driver = relationship("Driver")
    vehicle = relationship("Vehicle")

class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    make = Column(String)
    model = Column(String)
    year = Column(Integer)
    vehicle_multiplier = Column(Float)

class Driver(Base):
    __tablename__ = "drivers"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String)
    driving_history = Column(String) # This could be a JSON field in a real application
    ncb_level = Column(Integer)
