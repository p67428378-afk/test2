from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app import schemas, services
from app.database import get_db

router = APIRouter()

@router.post("/portfolios/", response_model=schemas.Portfolio)
def create_portfolio(portfolio: schemas.PortfolioCreate, db: Session = Depends(get_db)):
    return services.risk_assessment.create_portfolio(db=db, portfolio=portfolio)

@router.get("/portfolios/{portfolio_id}", response_model=schemas.Portfolio)
def get_portfolio(portfolio_id: int, db: Session = Depends(get_db)):
    return services.risk_assessment.get_portfolio(db=db, portfolio_id=portfolio_id)

@router.post("/portfolios/{portfolio_id}/assess-risk", response_model=schemas.RiskAssessmentResponse)
def assess_risk(portfolio_id: int, db: Session = Depends(get_db)):
    return services.risk_assessment.run_risk_assessment(db=db, portfolio_id=portfolio_id)
