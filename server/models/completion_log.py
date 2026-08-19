import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from server.database import Base


class CompletionLog(Base):
    __tablename__ = "completion_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    task_id = Column(
        String(36),
        ForeignKey("tasks.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    completed_by = Column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    completed_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    actual_cost = Column(Float, nullable=False, default=0.0)
    notes = Column(Text, nullable=True)
    receipt_reference = Column(String(255), nullable=True)
    next_task_id = Column(
        String(36), ForeignKey("tasks.id", ondelete="SET NULL"), nullable=True
    )

    # Relationships
    task = relationship(
        "Task", foreign_keys=[task_id], back_populates="completion_logs"
    )
    user = relationship("User", foreign_keys=[completed_by])
    next_task = relationship("Task", foreign_keys=[next_task_id])
