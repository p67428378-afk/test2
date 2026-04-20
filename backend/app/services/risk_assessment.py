from sqlalchemy.orm import Session
from app import models, schemas

def create_portfolio(db: Session, portfolio: schemas.PortfolioCreate):
    db_portfolio = models.Portfolio(client_id=portfolio.client_id)
    db.add(db_portfolio)
    db.commit()
    db.refresh(db_portfolio)
    for holding in portfolio.holdings:
        db_holding = models.Holding(**holding.dict(), portfolio_id=db_portfolio.id)
        db.add(db_holding)
    db.commit()
    db.refresh(db_portfolio)
    return db_portfolio

def get_portfolio(db: Session, portfolio_id: int):
    return db.query(models.Portfolio).filter(models.Portfolio.id == portfolio_id).first()

def run_risk_assessment(db: Session, portfolio_id: int):
    # Placeholder implementation
    return {
        "portfolio_id": portfolio_id,
        "var": 0.05,
        "stress_test_results": {"scenario_1": "-10%"},
        "sebi_violations": [],
        "risk_score": 5,
        "recommendations": ["Diversify your portfolio"]
    }
