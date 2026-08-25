import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Float,
    Integer,
    DateTime,
    ForeignKey,
    UniqueConstraint,
    CheckConstraint,
)
from sqlalchemy.orm import relationship
from server.database import Base


class Budget(Base):
    __tablename__ = "budgets"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    category_id = Column(
        String(36), ForeignKey("categories.id", ondelete="CASCADE"), nullable=False
    )
    monthly_limit = Column(Float, nullable=False)
    month = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)
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

    __table_args__ = (
        UniqueConstraint("category_id", "month", "year", name="uq_category_month_year"),
        CheckConstraint("monthly_limit > 0", name="check_positive_monthly_limit"),
        CheckConstraint("month >= 1 AND month <= 12", name="check_valid_month"),
        CheckConstraint("year >= 2020", name="check_valid_year"),
    )

    category = relationship("Category", back_populates="budgets")
