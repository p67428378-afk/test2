
from sqlalchemy import Column, Integer, String, Date, Float, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class Policy(Base):
    __tablename__ = "policies"

    id = Column(Integer, primary_key=True, index=True)
    policy_holder_id = Column(Integer, ForeignKey("policy_holders.id"))
    coverage_type = Column(String)
    start_date = Column(Date)
    end_date = Column(Date)
    premium_amount = Column(Float)
    status = Column(String)

    policy_holder = relationship("PolicyHolder", back_populates="policies")
    beneficiaries = relationship("Beneficiary", back_populates="policy")

class PolicyHolder(Base):
    __tablename__ = "policy_holders"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    contact_information = Column(String)
    address = Column(String)

    policies = relationship("Policy", back_populates="policy_holder")

class Beneficiary(Base):
    __tablename__ = "beneficiaries"

    id = Column(Integer, primary_key=True, index=True)
    policy_id = Column(Integer, ForeignKey("policies.id"))
    name = Column(String)
    beneficiary_relationship = Column(String)
    date_of_birth = Column(Date)

    policy = relationship("Policy", back_populates="beneficiaries")
