from sqlalchemy import Column, Integer, String, Date, Float, ForeignKey
from sqlalchemy.orm import relationship
from backend.database import Base

class PolicyHolder(Base):
    __tablename__ = "policy_holders"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    policies = relationship("Policy", back_populates="policy_holder")

class Policy(Base):
    __tablename__ = "policies"

    id = Column(Integer, primary_key=True, index=True)
    policy_number = Column(String, unique=True, index=True)
    coverage_type = Column(String)
    premium_amount = Column(Float)
    effective_date = Column(Date)
    expiration_date = Column(Date)
    policy_holder_id = Column(Integer, ForeignKey("policy_holders.id"))

    policy_holder = relationship("PolicyHolder", back_populates="policies")
