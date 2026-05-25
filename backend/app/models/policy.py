import uuid
from sqlalchemy import Column, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class PolicyHolder(Base):
    __tablename__ = "policy_holders"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, index=True)
    address = Column(String)
    contact_info = Column(String)
    authentication_details = Column(String)
    policies = relationship("Policy", back_populates="policy_holder")

class Policy(Base):
    __tablename__ = "policies"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    policy_number = Column(String, unique=True, index=True)
    plan_type = Column(String)
    premium_amount = Column(Float)
    effective_date = Column(Date)
    expiration_date = Column(Date)
    status = Column(String)
    policy_holder_id = Column(String, ForeignKey("policy_holders.id"))
    policy_holder = relationship("PolicyHolder", back_populates="policies")
    coverage_details = relationship("CoverageDetails", back_populates="policy")
    beneficiaries = relationship("Beneficiary", back_populates="policy")
    change_requests = relationship("PolicyChangeRequest", back_populates="policy")

class CoverageDetails(Base):
    __tablename__ = "coverage_details"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    type = Column(String)
    limits = Column(String)
    deductibles = Column(String)
    policy_id = Column(String, ForeignKey("policies.id"))
    policy = relationship("Policy", back_populates="coverage_details")

class Beneficiary(Base):
    __tablename__ = "beneficiaries"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String)
    relationship_type = Column(String)
    contact_info = Column(String)
    policy_id = Column(String, ForeignKey("policies.id"))
    policy = relationship("Policy", back_populates="beneficiaries")

class PolicyChangeRequest(Base):
    __tablename__ = "policy_change_requests"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    request_type = Column(String)
    status = Column(String)
    submission_date = Column(Date)
    approval_date = Column(Date)
    policy_id = Column(String, ForeignKey("policies.id"))
    policy = relationship("Policy", back_populates="change_requests")
