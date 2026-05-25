from pydantic import BaseModel, Field, field_validator
import re

class Form16ARequest(BaseModel):
    customerPan: str = Field(..., alias="customerPan")
    financialYear: str = Field(..., alias="financialYear")

    @field_validator('customerPan')
    def validate_pan(cls, v):
        if not re.match(r'[A-Z]{5}[0-9]{4}[A-Z]{1}', v):
            raise ValueError('Invalid PAN format')
        return v

    @field_validator('financialYear')
    def validate_fy(cls, v):
        if not re.match(r'\d{4}-\d{4}', v):
            raise ValueError('Invalid financial year format')
        return v
