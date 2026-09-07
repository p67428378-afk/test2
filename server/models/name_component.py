import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from server.database import Base, GUID

class NameComponent(Base):
    __tablename__ = "name_components"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    genre_id = Column(
        GUID,
        ForeignKey("genres.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    component_type = Column(
        String(30), nullable=False, index=True
    )  # 'prefix', 'base', 'suffix', 'descriptor'
    value = Column(String(100), nullable=False)
    sub_tag = Column(
        String(50), nullable=True, index=True
    )  # 'male', 'female', 'neutral'
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    genre = relationship("Genre", back_populates="components")
