
import enum
from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, Enum
from sqlalchemy.orm import relationship
from ..database import Base

class PolicyHolder(Base):
    __tablename__ = "policy_holders"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    address = Column(String)
    contact_info = Column(String)
    authentication_details = Column(String)

    policies = relationship("Policy", back_populates="policy_holder")

class PolicyStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    CANCELED = "CANCELED"
    PENDING = "PENDING"

class Policy(Base):
    __tablename__ = "policies"

    id = Column(Integer, primary_key=True, index=True)
    policy_holder_id = Column(Integer, ForeignKey("policy_holders.id"))
    policy_number = Column(String, unique=True, index=True)
    plan_type = Column(String)
    premium_amount = Column(Float)
    effective_date = Column(Date)
    expiration_date = Column(Date)
    status = Column(Enum(PolicyStatus), default=PolicyStatus.ACTIVE)

    policy_holder = relationship("PolicyHolder", back_populates="policies")
    coverage_details = relationship("CoverageDetails", back_populates="policy")
    beneficiaries = relationship("Beneficiary", back_populates="policy")
    change_requests = relationship("PolicyChangeRequest", back_populates="policy")

class CoverageDetails(Base):
    __tablename__ = "coverage_details"

    id = Column(Integer, primary_key=True, index=True)
    policy_id = Column(Integer, ForeignKey("policies.id"))
    type = Column(String)
    limits = Column(String)
    deductibles = Column(String)

    policy = relationship("Policy", back_populates="coverage_details")

class Beneficiary(Base):
    __tablename__ = "beneficiaries"

    id = Column(Integer, primary_key=True, index=True)
    policy_id = Column(Integer, ForeignKey("policies.id"))
    name = Column(String)
    beneficiary_relationship = Column(String)
    contact_info = Column(String)

    policy = relationship("Policy", back_populates="beneficiaries")

class RequestType(str, enum.Enum):
    ADDRESS_CHANGE = "ADDRESS_CHANGE"
    ADD_DEPENDENT = "ADD_DEPENDENT"
    CANCEL = "CANCEL"

class RequestStatus(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"

class PolicyChangeRequest(Base):
    __tablename__ = "policy_change_requests"

    id = Column(Integer, primary_key=True, index=True)
    policy_id = Column(Integer, ForeignKey("policies.id"))
    request_type = Column(Enum(RequestType))
    status = Column(Enum(RequestStatus), default=RequestStatus.PENDING)
    submission_date = Column(Date)
    approval_date = Column(Date, nullable=True)

    policy = relationship("Policy", back_populates="change_requests")
