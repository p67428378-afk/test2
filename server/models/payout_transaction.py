from sqlalchemy import Column, String, DateTime, Numeric, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from server.database import Base
from sqlalchemy.sql import func

class PayoutTransaction(Base):
    __tablename__ = "payout_transactions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    batch_id = Column(UUID(as_uuid=True), ForeignKey("payout_batches.id"))
    fd_rd_account_number = Column(String, nullable=False)
    linked_savings_account_number = Column(String, nullable=False)
    gross_interest = Column(Numeric(10, 2), nullable=False)
    tds_amount = Column(Numeric(10, 2), nullable=False)
    net_payout_amount = Column(Numeric(10, 2), nullable=False)
    status = Column(String, nullable=False)
    failure_reason = Column(String, nullable=True)
    form_16a_generated = Column(Boolean, default=False)
    form_16a_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    batch = relationship("PayoutBatch")
