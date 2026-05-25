from sqlalchemy import Column, String, Date, Float, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base
import uuid

class Policyholder(Base):
    __tablename__ = "policyholders"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, index=True)
    address = Column(String)
    contact_info = Column(String)
    date_of_birth = Column(Date)

    policies = relationship("Policy", back_populates="policyholder")

class Policy(Base):
    __tablename__ = "policies"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    policy_number = Column(String, unique=True, index=True)
    policy_type = Column(String)
    effective_date = Column(Date)
    expiration_date = Column(Date)
    billing_date = Column(Date)
    status = Column(String)
    premium_amount = Column(Float)
    policyholder_id = Column(String, ForeignKey("policyholders.id"))

    policyholder = relationship("Policyholder", back_populates="policies")
    coverage_options = relationship("CoverageOption", back_populates="policy")
    policy_history = relationship("PolicyHistory", back_populates="policy")

class CoverageOption(Base):
    __tablename__ = "coverage_options"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    policy_id = Column(String, ForeignKey("policies.id"))
    coverage_type = Column(String)
    details = Column(String)
    start_date = Column(Date)
    end_date = Column(Date)

    policy = relationship("Policy", back_populates="coverage_options")

class PolicyHistory(Base):
    __tablename__ = "policy_history"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    policy_id = Column(String, ForeignKey("policies.id"))
    action = Column(String)
    timestamp = Column(Date)
    user = Column(String)
    changes_made = Column(String)

    policy = relationship("Policy", back_populates="policy_history")
