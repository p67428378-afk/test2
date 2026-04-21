from sqlalchemy import Column, Float, ForeignKey, String
from sqlalchemy.orm import relationship
from ..core.database import Base

class Account(Base):
    __tablename__ = "accounts"

    id = Column(String, primary_key=True, index=True)
    account_number = Column(String, unique=True, index=True)
    account_type = Column(String)
    balance = Column(Float)
    currency = Column(String)
    user_id = Column(String, ForeignKey("users.id"))

    owner = relationship("User", back_populates="accounts")
