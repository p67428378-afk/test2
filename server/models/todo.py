import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, Boolean, DateTime
from server.database import Base


def get_utc_now():
    return datetime.now(timezone.utc)


class Todo(Base):
    __tablename__ = "todos"

    id = Column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        index=True,
    )
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    completed = Column(Boolean, nullable=False, default=False)
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=get_utc_now,
    )
    updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=get_utc_now,
        onupdate=get_utc_now,
    )
