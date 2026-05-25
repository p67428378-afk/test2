from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.schemas.statement import StatementRequest, Statement
from backend.app.services import statement_service
from backend.app.db.database import get_db

router = APIRouter()

@router.post("/statements/", response_model=Statement)
def generate_statement_endpoint(request: StatementRequest, db: Session = Depends(get_db)):
    if request.start_date > request.end_date:
        raise HTTPException(status_code=400, detail="Start date cannot be after end date.")
    # In a real application, you would fetch this from a database or another service
    opening_balance = 1000.0
    transactions = statement_service.get_transactions(db, request.account_number, request.start_date, request.end_date)
    closing_balance = opening_balance + sum(t.amount for t in transactions if t.type == 'credit') - sum(t.amount for t in transactions if t.type == 'debit')

    statement = Statement(
        account_number=request.account_number,
        start_date=request.start_date,
        end_date=request.end_date,
        opening_balance=opening_balance,
        closing_balance=closing_balance,
        transactions=transactions
    )

    if request.format == 'pdf':
        return statement_service.generate_pdf_statement(statement)
    elif request.format == 'excel':
        return statement_service.generate_excel_statement(statement)
