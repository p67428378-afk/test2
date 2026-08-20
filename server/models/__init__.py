"""Database models package."""

from server.database import Base
from server.models.queue import QueueTicket

__all__ = ["Base", "QueueTicket"]
