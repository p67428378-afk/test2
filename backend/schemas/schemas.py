from pydantic import BaseModel
from typing import Optional

class CustomerBase(BaseModel):
    customer_id: str
    mobile_number: str

class CustomerCreate(CustomerBase):
    password: str

class Customer(CustomerBase):
    id: int

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    customer_id: Optional[str] = None

class MobileNumberUpdateRequest(BaseModel):
    customer_id: str
    new_mobile_number: str

class OTPRequest(BaseModel):
    customer_id: str

class OTPVerify(BaseModel):
    customer_id: str
    otp: str

class OTPVerifyNew(OTPVerify):
    new_mobile_number: str

class MobileNumberUpdateResponse(BaseModel):
    status: str
    message: str
