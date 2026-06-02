
import uuid
from sqlalchemy import Column, String, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.sql import func
from server.models.base import Base

class Devotee(Base):
    __tablename__ = "devotees"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    family_members = Column(ARRAY(Text))
    gothra = Column(String(255))
    nakshatra = Column(String(255))
    rashi = Column(String(255))
    purpose = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
