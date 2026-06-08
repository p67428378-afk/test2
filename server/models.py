import uuid

from sqlalchemy import Column, DateTime, Float, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from server.database import Base


class Policy(Base):
    __tablename__ = "policies"

    policy_id = Column(
        UUID(as_uuid=True).with_variant(String(36), "sqlite"),
        primary_key=True,
        default=uuid.uuid4,
    )
    customer_id = Column(UUID(as_uuid=True).with_variant(String(36), "sqlite"))
    vehicle_make = Column(String)
    vehicle_model = Column(String)
    vehicle_year = Column(Integer)
    vehicle_type = Column(
        String
    )  # Using String instead of Enum for broader compatibility
    no_claim_years = Column(Integer)
    premium_amount = Column(Float)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
