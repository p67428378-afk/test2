
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from server.app.db.base_class import Base

class Customer(Base):
    __tablename__ = "customers"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)

    policies = relationship("Policy", back_populates="customer")
