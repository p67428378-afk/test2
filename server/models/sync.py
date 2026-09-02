import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, JSON
from server.database import Base


class SyncTransaction(Base):
    __tablename__ = "sync_transactions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    client_tx_id = Column(String(100), nullable=False, index=True)
    user_id = Column(String(36), nullable=True)
    payload_type = Column(String(50), nullable=False)
    payload = Column(JSON, nullable=True)
    status = Column(String(30), default="SYNCED", nullable=False)
    client_timestamp = Column(DateTime(timezone=True), nullable=True)
    server_timestamp = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
