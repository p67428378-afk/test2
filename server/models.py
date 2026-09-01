import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, DateTime, String
from server.database import Base


class PasswordLog(Base):
    """Optional placeholder model to follow Constitution v1.0.0 standards."""

    __tablename__ = "password_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
