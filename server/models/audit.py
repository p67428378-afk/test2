import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, JSON
from server.database import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    log_id = Column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        unique=True,
        nullable=False,
    )
    table_name = Column(String(100), nullable=False)
    record_id = Column(String(36), nullable=False)
    operation = Column(String(50), nullable=False)
    changed_by = Column(String(100), nullable=False)
    changed_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    old_data = Column(JSON, nullable=True)
    new_data = Column(JSON, nullable=True)
