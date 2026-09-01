import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from server.database import Base
from server.models.visitor import GUID


class EntryExitLog(Base):
    __tablename__ = "entry_exit_logs"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    appointment_id = Column(
        GUID,
        ForeignKey("appointments.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    officer_id = Column(GUID, nullable=True)
    check_in_time = Column(DateTime(timezone=True), nullable=True)
    check_out_time = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    appointment = relationship("Appointment", back_populates="entry_exit_logs")
