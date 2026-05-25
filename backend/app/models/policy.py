import uuid
from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from ..db.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Policy(Base):
    __tablename__ = "policies"

    id = Column(String, primary_key=True, default=generate_uuid)
    policy_number = Column(String, unique=True, index=True)
    policyholder_name = Column(String)
    policy_start_date = Column(Date)
    policy_end_date = Column(Date)
    base_premium = Column(Float)
    calculated_premium = Column(Float)
    status = Column(String)
    driver_id = Column(String, ForeignKey("drivers.id"))

    driver = relationship("Driver")
    vehicles = relationship("Vehicle", back_populates="policy")

class Driver(Base):
    __tablename__ = "drivers"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String)
    age = Column(Integer)
    license_number = Column(String, unique=True)
    ncb_history_id = Column(String, ForeignKey("ncb_history.id"))

    ncb_history = relationship("NCBHistory")

class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(String, primary_key=True, default=generate_uuid)
    make = Column(String)
    model = Column(String)
    year = Column(Integer)
    type = Column(String)
    power = Column(Float)
    vehicle_multiplier = Column(Float)
    policy_id = Column(String, ForeignKey("policies.id"))

    policy = relationship("Policy", back_populates="vehicles")

class NCBHistory(Base):
    __tablename__ = "ncb_history"

    id = Column(String, primary_key=True, default=generate_uuid)
    claim_free_years = Column(Integer)
    ncb_discount_percentage = Column(Float)
    last_claim_date = Column(Date, nullable=True)
