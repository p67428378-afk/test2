import uuid
import datetime
from sqlalchemy import Column, String, Float, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class TopUpApplication(Base):
    __tablename__ = "top_up_applications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    loan_account_number = Column(String, nullable=False)
    status = Column(String, nullable=False)
    eligible_amount = Column(Float, nullable=True)
    reason = Column(String, nullable=True)
    created_at = Column(TIMESTAMP, default=datetime.datetime.utcnow)
    updated_at = Column(TIMESTAMP, default=datetime.datetime.utcnow)
