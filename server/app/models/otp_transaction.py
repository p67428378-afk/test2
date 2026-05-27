
from sqlalchemy import Column, DateTime, String, Numeric, func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.db.base import Base

class OtpTransaction(Base):
    __tablename__ = "otp_transactions"

    transaction_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tokenized_card_number = Column(String, nullable=False)
    daily_spend_threshold = Column(Numeric, nullable=False)
    alert_delivery_channel = Column(String, nullable=False)
    otp_hash = Column(String, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, nullable=False, default=func.now())
