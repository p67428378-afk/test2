from sqlalchemy import Column, String, DateTime, Numeric
from sqlalchemy.dialects.postgresql import UUID
import uuid
from server.database import Base
from sqlalchemy.sql import func

class TDSConfiguration(Base):
    __tablename__ = "tds_configurations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_category = Column(String, nullable=False, unique=True)
    min_interest_threshold = Column(Numeric(10, 2), nullable=False)
    tds_rate = Column(Numeric(5, 2), nullable=False)
    effective_date = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
