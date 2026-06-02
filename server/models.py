
from sqlalchemy import Column, String, UUID, TIMESTAMP, Date, Boolean, INTEGER
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
import uuid

Base = declarative_base()

class Pandit(Base):
    __tablename__ = "pandits"
    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    created_at = Column(TIMESTAMP, default=func.now())
    updated_at = Column(TIMESTAMP, default=func.now(), onupdate=func.now())

class PanditAvailability(Base):
    __tablename__ = "pandit_availability"
    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    pandit_id = Column(UUID, nullable=False)
    date = Column(Date, nullable=False)
    is_blocked = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, default=func.now())
    updated_at = Column(TIMESTAMP, default=func.now(), onupdate=func.now())

class PanditShift(Base):
    __tablename__ = "pandit_shifts"
    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    pandit_id = Column(UUID, nullable=False)
    date = Column(Date, nullable=False)
    shift = Column(String, nullable=False)
    location = Column(String)
    created_at = Column(TIMESTAMP, default=func.now())
    updated_at = Column(TIMESTAMP, default=func.now(), onupdate=func.now())

class Booking(Base):
    __tablename__ = "bookings"
    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    pandit_id = Column(UUID, nullable=False)
    devotee_id = Column(UUID, nullable=False)
    puja_type = Column(String, nullable=False)
    booking_time = Column(TIMESTAMP, nullable=False)
    location = Column(String)
    buffer_minutes = Column(INTEGER, default=0)
    created_at = Column(TIMESTAMP, default=func.now())
    updated_at = Column(TIMESTAMP, default=func.now(), onupdate=func.now())

class Devotee(Base):
    __tablename__ = "devotees"
    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    family_members = Column(String) # Changed from ARRAY(String)
    gothra = Column(String)
    nakshatra = Column(String)
    rashi = Column(String)
    purpose = Column(String)
    created_at = Column(TIMESTAMP, default=func.now())
    updated_at = Column(TIMESTAMP, default=func.now(), onupdate=func.now())
