from pydantic import BaseModel
from datetime import date

class InterestCertificateBase(BaseModel):
    customer_id: str
    financial_year: str

class InterestCertificateCreate(InterestCertificateBase):
    pass

class InterestCertificate(InterestCertificateBase):
    id: int
    savings_interest: float
    fd_interest: float
    total_interest: float
    tds_deducted: float
    net_interest: float
    generation_date: date

    class Config:
        orm_mode = True
