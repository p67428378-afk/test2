from sqlalchemy import Column, Integer, String, Date, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base

class PolicyHolder(Base):
    __tablename__ = "policy_holders"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    phone_number = Column(String)
    address = Column(String)
    hashed_password = Column(String)

    policies = relationship("Policy", back_populates="policy_holder")

class Policy(Base):
    __tablename__ = "policies"

    id = Column(Integer, primary_key=True, index=True)
    policy_number = Column(String, unique=True, index=True)
    coverage_type = Column(String)
    effective_date = Column(Date)
    expiration_date = Column(Date)
    premium_amount = Column(Float)
    status = Column(String)
    policy_holder_id = Column(Integer, ForeignKey("policy_holders.id"))

    policy_holder = relationship("PolicyHolder", back_populates="policies")
    beneficiaries = relationship("Beneficiary", back_populates="policy")

class Beneficiary(Base):
    __tablename__ = "beneficiaries"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    relationship_type = Column(String)
    date_of_birth = Column(Date)
    policy_id = Column(Integer, ForeignKey("policies.id"))

    policy = relationship("Policy", back_populates="beneficiaries")
