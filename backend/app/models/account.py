from sqlalchemy import Column, Float, Integer, String

from app.db.base import Base


class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True)
    account_number = Column(String, unique=True, index=True)
    account_type = Column(String)
    balance = Column(Float)
    currency = Column(String)
