import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from server.database import Base


class TaskAssignment(Base):
    __tablename__ = "task_assignments"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    task_id = Column(
        String(36), ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False
    )
    assigned_to = Column(
        String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    assigned_by = Column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    assigned_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    status = Column(
        String(50), nullable=False, default="Active"
    )  # Active, Reassigned, Unassigned

    # Relationships
    task = relationship("Task", back_populates="assignments")
    assignee = relationship("User", foreign_keys=[assigned_to])
    assigner = relationship("User", foreign_keys=[assigned_by])
