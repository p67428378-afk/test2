import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from server.database import Base


class CostLog(Base):
    __tablename__ = "cost_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    task_id = Column(String(36), ForeignKey("maintenance_tasks.id"), nullable=False)
    cost_type = Column(String(50), nullable=False)  # 'Estimated' or 'Actual'
    amount = Column(Float, nullable=False)
    notes = Column(Text, nullable=True)
    recorded_by_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    task = relationship("Task", back_populates="cost_logs")
    recorded_by = relationship(
        "User", back_populates="cost_logs", foreign_keys=[recorded_by_id]
    )
