import uuid
from sqlalchemy import Column, String, Float, Date, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.db.session import Base

class Policy(Base):
    __tablename__ = "policies"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    policy_holder_id = Column(String, nullable=False)
    policy_number = Column(String, unique=True, index=True, nullable=False)
    plan_type = Column(String, nullable=False)
    premium_amount = Column(Float, nullable=False)
    effective_date = Column(Date, nullable=False)
    expiration_date = Column(Date, nullable=False)
    status = Column(String, nullable=False, default="active")
