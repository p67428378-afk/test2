import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Numeric, DateTime
from server.database import Base


class FXRate(Base):
    __tablename__ = "fx_rates"

    rate_id = Column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        unique=True,
        nullable=False,
    )
    source_currency = Column(String(10), nullable=False)
    target_currency = Column(String(10), nullable=False)
    base_rate = Column(Numeric(18, 6), nullable=False)
    bid_rate = Column(Numeric(18, 6), nullable=False)
    ask_rate = Column(Numeric(18, 6), nullable=False)
    spread = Column(Numeric(18, 6), nullable=False)
    fee = Column(Numeric(18, 4), nullable=False)
    provider = Column(String(100), nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
