import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from server.database import Base


class Donation(Base):
    __tablename__ = "donations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    campaign_id = Column(
        String(36), ForeignKey("campaigns.id", ondelete="CASCADE"), nullable=False
    )
    user_id = Column(
        String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    donor_name = Column(String(150), nullable=False)
    donor_email = Column(String(255), nullable=False)
    amount = Column(Float, nullable=False)
    payment_status = Column(String(50), default="Completed", nullable=False)
    transaction_id = Column(String(100), unique=True, nullable=False)
    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )

    campaign = relationship("Campaign", back_populates="donations")
    user = relationship("User")
