import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Numeric, DateTime
from server.database import Base


class Payment(Base):
    __tablename__ = "payments"

    payment_id = Column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        unique=True,
        nullable=False,
    )
    source_account_id = Column(String(36), nullable=False)
    beneficiary_name = Column(String(255), nullable=False)
    beneficiary_account_number = Column(String(100), nullable=False)
    beneficiary_routing_number = Column(String(100), nullable=False)
    destination_country = Column(String(100), nullable=False)
    source_currency = Column(String(10), nullable=False)
    target_currency = Column(String(10), nullable=False)
    amount = Column(Numeric(18, 4), nullable=False)
    rate = Column(Numeric(18, 6), nullable=False)
    fee = Column(Numeric(18, 4), nullable=False)
    settlement_network = Column(String(50), nullable=False)
    status = Column(String(50), default="Pending", nullable=False)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
