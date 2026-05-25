from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import date

class HoldingBase(BaseModel):
    asset_type: str
    quantity: float
    purchase_price: float
    purchase_date: date

class HoldingCreate(HoldingBase):
    pass

class Holding(HoldingBase):
    id: int
    portfolio_id: int

    model_config = ConfigDict(from_attributes=True)

class PortfolioBase(BaseModel):
    client_id: int

class PortfolioCreate(PortfolioBase):
    holdings: List[HoldingCreate] = []

class Portfolio(PortfolioBase):
    id: int
    holdings: List[Holding] = []

    model_config = ConfigDict(from_attributes=True)

class RiskAssessmentRequest(BaseModel):
    portfolio_id: int

class RiskAssessmentResponse(BaseModel):
    portfolio_id: int
    var: float
    stress_test_results: dict
    sebi_violations: list
    risk_score: int
    recommendations: list
