
import uuid
from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from server.database import Base

class AlertConfig(Base):
    __tablename__ = "alert_configs"

    config_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=False, unique=True)
    threshold_percentage = Column(Integer, nullable=False)
    leak_detection_period_hours = Column(Integer, nullable=False)

    user = relationship("User", back_populates="alert_config")
