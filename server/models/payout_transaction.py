
from sqlalchemy import Column, String, DateTime, Numeric, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from server.database import Base
from datetime import datetime

class PayoutTransaction(Base):
    __tablename__ = "payout_transactions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    batch_id = Column(UUID(as_uuid=True), ForeignKey('payout_batches.id'))
    fd_rd_account_number = Column(String, nullable=False)
    linked_savings_account_number = Column(String, nullable=False)
    gross_interest = Column(Numeric(10, 2), nullable=False)
    tds_amount = Column(Numeric(10, 2), nullable=False)
    net_payout_amount = Column(Numeric(10, 2), nullable=False)
    status = Column(String, nullable=False)
    failure_reason = Column(String, nullable=True)
    form_16a_generated = Column(Boolean, default=False)
    form_16a_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    batch = relationship("PayoutBatch", back_populates="transactions")
