
from sqlalchemy import Column, String, DateTime, Integer, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from server.database import Base
from datetime import datetime

class PayoutBatch(Base):
    __tablename__ = "payout_batches"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    status = Column(String, nullable=False)
    start_time = Column(DateTime, nullable=True)
    end_time = Column(DateTime, nullable=True)
    total_accounts_processed = Column(Integer, default=0)
    total_gross_interest = Column(Numeric(10, 2), default=0)
    total_tds_deducted = Column(Numeric(10, 2), default=0)
    total_net_payout = Column(Numeric(10, 2), default=0)
    report_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    transactions = relationship("PayoutTransaction", back_populates="batch")
