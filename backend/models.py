
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from .database import Base
import datetime

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(String, unique=True, index=True)
    amount = Column(Float)
    sender = Column(String)
    receiver = Column(String)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String, default="PENDING")
    device_fingerprint = Column(String)
    is_mule_account = Column(Boolean, default=False)
    npci_positive_pay_status = Column(String, default="NOT_APPLICABLE")
