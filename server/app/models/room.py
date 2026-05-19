
import uuid
from sqlalchemy import Column, String, DateTime, Float, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.session import Base

class Room(Base):
    __tablename__ = "rooms"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    hotel_id = Column(UUID(as_uuid=True), ForeignKey("hotels.id"))
    room_number = Column(String(50), nullable=False)
    type = Column(String(50))
    status = Column(String(50))
    price = Column(Float)
    created_at = Column(DateTime, default=func.utcnow())

    hotel = relationship("Hotel")
