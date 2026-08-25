import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Float,
    Date,
    Text,
    DateTime,
    ForeignKey,
    CheckConstraint,
)
from sqlalchemy.orm import relationship
from server.database import Base


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(200), nullable=False)
    amount = Column(Float, nullable=False)
    category_id = Column(
        String(36), ForeignKey("categories.id", ondelete="CASCADE"), nullable=False
    )
    expense_date = Column(Date, nullable=False, index=True)
    payment_method = Column(String(50), default="Credit Card", nullable=False)
    description = Column(Text, nullable=True)
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
        CheckConstraint("amount > 0", name="check_positive_expense_amount"),
    )

    category = relationship("Category", back_populates="expenses")
