from sqlalchemy import Column, Integer, String, Date, Float, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base
import uuid

class Policy(Base):
    __tablename__ = "policies"

    policy_id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    policy_number = Column(String, unique=True, index=True)
    plan_type = Column(String)
    deductible = Column(Float)
    co_pay = Column(Float)
    premium_amount = Column(Float)
    effective_date = Column(Date)
    expiration_date = Column(Date)
    status = Column(String) # Active, Cancelled, Pending
    user_id = Column(String, ForeignKey("policy_holders.user_id"))

    policy_holder = relationship("PolicyHolder", back_populates="policies")
    # beneficiaries = relationship("Beneficiary", back_populates="linked_policy")
    # claims = relationship("Claim", back_populates="linked_policy")

class PolicyHolder(Base):
    __tablename__ = "policy_holders"

    user_id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    first_name = Column(String)
    last_name = Column(String)
    email = Column(String, unique=True, index=True)
    phone_number = Column(String)
    address = Column(String)

    policies = relationship("Policy", back_populates="policy_holder")
    # payment_methods = relationship("PaymentMethod", back_populates="policy_holder")

class Beneficiary(Base):
    __tablename__ = "beneficiaries"

    beneficiary_id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    policy_id = Column(String, ForeignKey("policies.policy_id"))
    name = Column(String)
    relationship = Column(String)
    date_of_birth = Column(Date)

    # linked_policy = relationship("Policy", back_populates="beneficiaries")

class Claim(Base):
    __tablename__ = "claims"

    claim_id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    policy_id = Column(String, ForeignKey("policies.policy_id"))
    date_of_service = Column(Date)
    provider = Column(String)
    amount = Column(Float)
    status = Column(String) # Approved, Denied, Pending

    # linked_policy = relationship("Policy", back_populates="claims")

class PaymentMethod(Base):
    __tablename__ = "payment_methods"

    payment_method_id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("policy_holders.user_id"))
    type = Column(String) # Credit Card, Bank Account
    details = Column(String) # encrypted tokenized data
    last_four_digits = Column(String)
    expiration_date = Column(Date)

    # policy_holder = relationship("PolicyHolder", back_populates="payment_methods")
