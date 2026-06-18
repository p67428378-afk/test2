import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Numeric, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from server.database import Base


class FraudScore(Base):
    __tablename__ = "fraud_scores"

    score_id = Column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        unique=True,
        nullable=False,
    )
    payment_id = Column(String(36), ForeignKey("payments.payment_id"), nullable=False)
    score = Column(Numeric(5, 2), nullable=False)
    status = Column(String(50), nullable=False)
    details = Column(Text, nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    payment = relationship("Payment", backref="fraud_scores")
