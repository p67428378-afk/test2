
from sqlalchemy import Column, Float, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from server.app.db.base_class import Base

class Policy(Base):
    __tablename__ = "policies"

    id = Column(String, primary_key=True, index=True)
    customer_id = Column(String, ForeignKey("customers.id"))
    vehicle_id = Column(String, ForeignKey("vehicles.id"))
    base_premium = Column(Float, nullable=False)
    ncb_percentage = Column(Float, nullable=False)
    vehicle_multiplier = Column(Float, nullable=False)
    final_premium = Column(Float, nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)

    customer = relationship("Customer", back_populates="policies")
    vehicle = relationship("Vehicle", back_populates="policies")
