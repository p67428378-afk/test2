
from sqlalchemy import Column, DateTime, func, DECIMAL, Date
from sqlalchemy.dialects.postgresql import UUID
import uuid
from server.models.base import Base

class Kpi(Base):
    __tablename__ = "kpis"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sales_linear_ft = Column(DECIMAL(10, 2))
    private_brand_percent = Column(DECIMAL(5, 2))
    in_stock_rate = Column(DECIMAL(5, 2))
    shelf_capacity = Column(DECIMAL(5, 2))
    calculation_date = Column(Date, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
