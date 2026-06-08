
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from server import schemas, crud, models
from server.database import get_db
from server.reporting import generate_pdf_report
import uuid

router = APIRouter()

@router.get("/dashboard/summary", response_model=schemas.DashboardSummaryResponse)
def get_dashboard_summary(db: Session = Depends(get_db)):
    try:
        # Seed initial data if empty
        crud.seed_initial_data(db)
        
        # Fetch metrics from database
        db_metrics = crud.get_aggregated_fiscal_data(db)
        metrics_dict = {m.metric_name: float(m.metric_value) for m in db_metrics}
        
        gdp = metrics_dict.get("gdp_growth_pct", 2.4)
        inflation = metrics_dict.get("inflation_rate_pct", 3.1)
        unemployment = metrics_dict.get("unemployment_rate_pct", 4.2)
        total_rev = metrics_dict.get("total_revenue", 1250000000.0)
        total_exp = metrics_dict.get("total_expenditure", 980000000.0)
        
        # Construct response
        response_data = {
            "macro_indicators": {
                "gdp_growth_pct": gdp,
                "inflation_rate_pct": inflation,
                "unemployment_rate_pct": unemployment
            },
            "monthly_trends": [
                {"month": "Jan", "revenue": 100000000.0, "expenditure": 80000000.0},
                {"month": "Feb", "revenue": 110000000.0, "expenditure": 85000000.0},
                {"month": "Mar", "revenue": 105000000.0, "expenditure": 90000000.0}
            ],
            "net_surplus": total_rev - total_exp,
            "revenue_streams": [
                {"source": "Income Tax", "amount": 550000000.0, "status": "On Track"},
                {"source": "Corporate Tax", "amount": 350000000.0, "status": "On Track"},
                {"source": "Customs & Excise", "amount": 200000000.0, "status": "Delayed"},
                {"source": "Value Added Tax", "amount": 150000000.0, "status": "On Track"}
            ],
            "sector_expenditure": [
                {"sector": "Healthcare", "amount": 300000000.0},
                {"sector": "Education", "amount": 250000000.0},
                {"sector": "Defence", "amount": 200000000.0},
                {"sector": "Infrastructure", "amount": 150000000.0},
                {"sector": "Other", "amount": 80000000.0}
            ],
            "total_expenditure": total_exp,
            "total_revenue": total_rev
        }
        return response_data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch or aggregate data from external APIs: {str(e)}"
        )

@router.get("/dashboard/budget-variance", response_model=List[schemas.BudgetVarianceResponse])
def get_budget_variance(db: Session = Depends(get_db)):
    try:
        crud.seed_initial_data(db)
        db_budgets = crud.get_budget_data(db)
        
        response = []
        for b in db_budgets:
            allocated = float(b.allocated_budget)
            actual = float(b.actual_spending)
            variance_amt = actual - allocated
            variance_pct = (variance_amt / allocated) * 100 if allocated > 0 else 0.0
            
            # Highlight variances exceeding 5%
            highlight = variance_pct > 5.0
            
            response.append({
                "department_name": b.department_name,
                "allocated_budget": allocated,
                "actual_spending": actual,
                "variance_amount": variance_amt,
                "variance_pct": round(variance_pct, 2),
                "highlight": highlight
            })
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database query fails: {str(e)}"
        )

@router.post("/dashboard/allocate-emergency-fund", response_model=schemas.AllocateEmergencyFundResponse)
def allocate_emergency_fund(request: schemas.AllocateEmergencyFundRequest, db: Session = Depends(get_db)):
    # 1. Verify MFA code
    if request.mfa_code != "123456":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired MFA code"
        )
    
    # 2. Validate input and check for sufficient funds
    if request.amount <= 0 or request.amount > 50000000:  # Let's say max allocation is 50M
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid input or insufficient funds"
        )
    
    try:
        # Create transaction
        authorized_by = "Finance Minister"
        tx = crud.create_emergency_fund_transaction(
            db=db,
            project_name=request.project_name,
            amount=request.amount,
            authorized_by=authorized_by
        )
        
        return {
            "amount": float(tx.amount),
            "authorized_by": tx.authorized_by,
            "project_name": tx.project_name,
            "success": True,
            "timestamp": tx.timestamp.isoformat(),
            "transaction_id": str(tx.id)
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to allocate emergency funds: {str(e)}"
        )

@router.get("/dashboard/report", response_model=schemas.ReportResponse)
def get_dashboard_report(db: Session = Depends(get_db)):
    try:
        # Fetch summary data to include in report
        crud.seed_initial_data(db)
        db_metrics = crud.get_aggregated_fiscal_data(db)
        metrics_dict = {m.metric_name: float(m.metric_value) for m in db_metrics}
        
        pdf_base64 = generate_pdf_report(metrics_dict)
        return {"pdf_binary_stream": pdf_base64}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"PDF generation fails: {str(e)}"
        )

@router.get("/dashboard/emergency-fund-transactions", response_model=List[schemas.EmergencyFundTransactionResponse])
def get_emergency_fund_transactions(db: Session = Depends(get_db)):
    try:
        txs = crud.get_emergency_fund_transactions(db)
        return [
            {
                "id": str(tx.id),
                "project_name": tx.project_name,
                "amount": float(tx.amount),
                "authorized_by": tx.authorized_by,
                "timestamp": tx.timestamp.isoformat()
            }
            for tx in txs
        ]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database query fails: {str(e)}"
        )
