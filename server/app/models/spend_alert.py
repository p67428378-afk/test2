
from sqlalchemy import Column, DateTime, String, Numeric, func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.db.base import Base

class SpendAlert(Base):
    __tablename__ = "spend_alerts"

    alert_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = Column(UUID(as_uuid=True), nullable=False) # Assuming external customers table
    tokenized_card_number = Column(String, nullable=False, unique=True)
    daily_spend_threshold = Column(Numeric, nullable=False)
    alert_delivery_channel = Column(String, nullable=False)
    status = Column(String, nullable=False, default="INACTIVE")
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(DateTime, nullable=False, default=func.now(), onupdate=func.now())
