import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Float, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from server.database import Base


class Task(Base):
    __tablename__ = "tasks"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    category_id = Column(
        String(36),
        ForeignKey("categories.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )
    priority = Column(
        String(20), nullable=False, default="Medium"
    )  # Low, Medium, High, Urgent
    estimated_cost = Column(Float, nullable=False, default=0.0)
    actual_cost = Column(Float, nullable=True)
    frequency = Column(
        String(50), nullable=False, default="One-time"
    )  # One-time, Weekly, Monthly, Quarterly, Annual
    due_date = Column(Date, nullable=False, index=True)
    status = Column(
        String(50), nullable=False, default="Pending", index=True
    )  # Pending, In Progress, Overdue, Completed, Cancelled
    created_by = Column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    assigned_user_id = Column(
        String(36),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    # Relationships
    category = relationship("Category", back_populates="tasks")
    creator = relationship(
        "User", foreign_keys=[created_by], back_populates="created_tasks"
    )
    assigned_user = relationship(
        "User", foreign_keys=[assigned_user_id], back_populates="assigned_tasks"
    )
    assignments = relationship(
        "TaskAssignment", back_populates="task", cascade="all, delete-orphan"
    )
    completion_logs = relationship(
        "CompletionLog",
        foreign_keys="CompletionLog.task_id",
        back_populates="task",
        cascade="all, delete-orphan",
    )
