import uuid
from sqlalchemy import Column, String, Float
from app.db.base_class import Base

class CreditCard(Base):
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    product_name = Column(String, index=True)
    description = Column(String)
    interest_rate = Column(Float)
    annual_fee = Column(Float)
    credit_limit_range = Column(String)
    min_credit_score = Column(Float)
    min_income = Column(Float)
    image_url = Column(String)
