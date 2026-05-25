from pydantic import BaseModel, ConfigDict
from typing import Optional

# Shared properties
class CreditCardBase(BaseModel):
    product_name: str
    description: str
    interest_rate: float
    annual_fee: float
    credit_limit_range: str
    min_credit_score: float
    min_income: float
    image_url: str

# Properties to receive on item creation
class CreditCardCreate(CreditCardBase):
    pass

# Properties to receive on item update
class CreditCardUpdate(CreditCardBase):
    pass

# Properties shared by models in DB
class CreditCardInDBBase(CreditCardBase):
    id: str

    model_config = ConfigDict(from_attributes=True)

# Properties to return to client
class CreditCard(CreditCardInDBBase):
    pass

# Properties stored in DB
class CreditCardInDB(CreditCardInDBBase):
    pass
