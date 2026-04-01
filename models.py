import uuid
from sqlalchemy import Column, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Policy(Base):
    __tablename__ = "policies"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    policy_number = Column(String, unique=True, index=True)
    policyholder_id = Column(String, index=True)
    coverage_type = Column(String)
    effective_date = Column(Date)
    expiration_date = Column(Date)
    premium_amount = Column(Float)
    status = Column(String, default="Active")
    last_updated_date = Column(Date)
    created_date = Column(Date)

    coverage_options = relationship("CoverageOption", back_populates="policy", cascade="all, delete-orphan")
    beneficiaries = relationship("Beneficiary", back_populates="policy", cascade="all, delete-orphan")

class CoverageOption(Base):
    __tablename__ = "coverage_options"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    policy_id = Column(String, ForeignKey("policies.id"))
    option_name = Column(String)
    status = Column(String, default="Active")
    cost_impact = Column(Float)

    policy = relationship("Policy", back_populates="coverage_options")

class Beneficiary(Base):
    __tablename__ = "beneficiaries"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    policy_id = Column(String, ForeignKey("policies.id"))
    name = Column(String)
    relationship_to_policyholder = Column(String)
    date_of_birth = Column(Date)

    policy = relationship("Policy", back_populates="beneficiaries")
