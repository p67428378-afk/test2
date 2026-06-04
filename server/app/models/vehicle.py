
from sqlalchemy import Column, String, Integer
from sqlalchemy.orm import relationship
from server.app.db.base_class import Base

class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(String, primary_key=True, index=True)
    make = Column(String, nullable=False)
    model = Column(String, nullable=False)
    year = Column(Integer, nullable=False)
    vin = Column(String, unique=True, index=True, nullable=False)

    policies = relationship("Policy", back_populates="vehicle")
