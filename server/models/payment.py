import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from server.database import Base


class Payment(Base):
    __tablename__ = "payments"

    id = Column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        unique=True,
        nullable=False,
    )
    invoice_id = Column(String(36), ForeignKey("invoices.id"), nullable=False)
    amount = Column(Numeric(10, 2), default=0.00, nullable=False)
    payment_method = Column(String(100), nullable=False)
    payment_date = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    invoice = relationship("Invoice", back_populates="payments")
