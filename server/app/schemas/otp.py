
from pydantic import BaseModel, UUID4

class OTP(BaseModel):
    transaction_id: UUID4
    otp_code: str
