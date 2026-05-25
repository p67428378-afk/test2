from pydantic import BaseModel, ConfigDict

class AccountBase(BaseModel):
    account_number: str
    account_type: str
    balance: float
    currency: str

class AccountCreate(AccountBase):
    pass

class Account(AccountBase):
    id: str
    user_id: str

    model_config = ConfigDict(from_attributes=True)
