import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Numeric, DateTime
from server.database import Base


class RiskLimit(Base):
    __tablename__ = "risk_limits"

    limit_id = Column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        unique=True,
        nullable=False,
    )
    currency = Column(String(10), nullable=False)
    country = Column(String(10), nullable=False)
    limit_amount = Column(Numeric(18, 4), nullable=False)
    daily_cap = Column(Numeric(18, 4), nullable=False)
    weekly_cap = Column(Numeric(18, 4), nullable=False)
    current_daily_usage = Column(Numeric(18, 4), default=0, nullable=False)
    current_weekly_usage = Column(Numeric(18, 4), default=0, nullable=False)
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
