
import uuid
from sqlalchemy import Column, Date, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from server.models.base import Base

class Shift(Base):
    __tablename__ = "shifts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    pandit_id = Column(UUID(as_uuid=True), ForeignKey("pandits.id"), nullable=False)
    date = Column(Date, nullable=False)
    type = Column(String(50), nullable=False) # e.g., morning, evening
