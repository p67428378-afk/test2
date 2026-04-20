from sqlalchemy import Column, String, Float, Date
from backend.app.db.database import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(String, primary_key=True, index=True)
    account_number = Column(String, index=True)
    date = Column(Date)
    description = Column(String)
    amount = Column(Float)
    type = Column(String)  # "debit" or "credit"
