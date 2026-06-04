import uuid
from sqlalchemy import Column, String, TIMESTAMP, text, ForeignKey
from sqlalchemy.types import UUID
from sqlalchemy.orm import relationship
from server.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String(50), unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String(100), nullable=True)
    role = Column(String(50), nullable=False)
    station = Column(String(100), nullable=True)
    created_at = Column(TIMESTAMP, nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    updated_at = Column(TIMESTAMP, nullable=False, server_default=text("CURRENT_TIMESTAMP"), onupdate=text("CURRENT_TIMESTAMP"))

    forecast_grids = relationship("ForecastGrid", back_populates="user")
    warning_polygons = relationship("WarningPolygon", back_populates="user")
    text_products = relationship("TextProduct", back_populates="user")
    audit_logs = relationship("AuditLog", back_populates="user")
