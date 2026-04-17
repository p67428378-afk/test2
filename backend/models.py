
import uuid
from sqlalchemy import Column, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Policy(Base):
    __tablename__ = "policies"

    id = Column(String, primary_key=True, default=generate_uuid)
    policy_number = Column(String, unique=True, index=True)
    plan_type = Column(String)
    premium_amount = Column(Float)
    effective_date = Column(Date)
    expiration_date = Column(Date)
    status = Column(String)
    policy_holder_id = Column(String, ForeignKey("policy_holders.id"))

    policy_holder = relationship("PolicyHolder", back_populates="policies")

class PolicyHolder(Base):
    __tablename__ = "policy_holders"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String)
    address = Column(String)
    contact_info = Column(String)

    policies = relationship("Policy", back_populates="policy_holder")
