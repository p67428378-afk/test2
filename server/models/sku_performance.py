
from sqlalchemy import Column, String, Integer, DateTime, func, DECIMAL, ForeignKey, Date
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from server.models.base import Base

class SkuPerformance(Base):
    __tablename__ = "sku_performance"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"))
    sales = Column(DECIMAL(10, 2), nullable=False)
    profit_margin = Column(DECIMAL(5, 2), nullable=False)
    inventory_level = Column(Integer, nullable=False)
    status_badge = Column(String(50), nullable=False)
    calculation_date = Column(Date, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    product = relationship("Product")
