from sqlalchemy import Column, Integer, String, Date, Boolean, Enum
from app.db.database import Base
import enum

class Priority(str, enum.Enum):
    low = "Low"
    medium = "Medium"
    high = "High"
    urgent = "Urgent"

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(String, index=True)
    due_date = Column(Date)
    priority = Column(Enum(Priority))
    is_complete = Column(Boolean, default=False)
