import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from server.database import Base
from server.models.visitor import GUID


class Verification(Base):
    __tablename__ = "verifications"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    visitor_id = Column(
        GUID, ForeignKey("visitors.id", ondelete="CASCADE"), nullable=False, index=True
    )
    officer_id = Column(GUID, nullable=True)
    verification_status = Column(String(50), nullable=False)  # VERIFIED, REJECTED
    notes = Column(String(500), nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    visitor = relationship("Visitor", back_populates="verifications")
