
from pydantic import BaseModel

class Kpi(BaseModel):
    sales_linear_ft: float
    private_brand_percent: float
    in_stock_rate: float
    shelf_capacity: float

    class Config:
        orm_mode = True
