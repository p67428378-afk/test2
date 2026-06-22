import uuid
from sqlalchemy import Column, String, Text, DateTime, Uuid
from sqlalchemy.sql import func
from server.database import Base


class Greeting(Base):
    __tablename__ = "greetings"

    id = Column(
        Uuid(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        nullable=False,
    )
    greeting = Column(String(255), nullable=False)
    region = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
