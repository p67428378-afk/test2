from sqlalchemy import Column, Integer, String, Date, Float, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base_class import Base

class PolicyHolder(Base):
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    email = Column(String, unique=True, index=True, nullable=False)

class Policy(Base):
    id = Column(Integer, primary_key=True, index=True)
    policy_number = Column(String, index=True)
    coverage_type = Column(String)
    effective_date = Column(Date)
    expiration_date = Column(Date)
    premium_amount = Column(Float)
    status = Column(String, default="Active")
    policy_holder_id = Column(Integer, ForeignKey("policyholder.id"))
    policy_holder = relationship("PolicyHolder", back_populates="policies")

PolicyHolder.policies = relationship("Policy", order_by=Policy.id, back_populates="policy_holder")

class Beneficiary(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    relationship_type = Column(String)
    date_of_birth = Column(Date)
    policy_id = Column(Integer, ForeignKey("policy.id"))
    policy = relationship("Policy", back_populates="beneficiaries")

Policy.beneficiaries = relationship("Beneficiary", order_by=Beneficiary.id, back_populates="policy")
