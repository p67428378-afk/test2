import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from server.database import Base


class Task(Base):
    __tablename__ = "maintenance_tasks"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    location_equipment = Column(String(200), nullable=False)
    priority = Column(String(20), default="Medium", nullable=False)
    status = Column(String(30), default="Pending", nullable=False, index=True)
    estimated_cost = Column(Float, default=0.0, nullable=False)
    actual_cost = Column(Float, default=0.0, nullable=False)
    due_date = Column(DateTime, nullable=False, index=True)
    assigned_to_id = Column(
        String(36), ForeignKey("users.id"), nullable=True, index=True
    )
    resolution_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )
    completed_at = Column(DateTime, nullable=True)

    assigned_to = relationship(
        "User", back_populates="assigned_tasks", foreign_keys=[assigned_to_id]
    )
    cost_logs = relationship(
        "CostLog", back_populates="task", cascade="all, delete-orphan"
    )
