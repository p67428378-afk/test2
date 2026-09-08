from datetime import date
from typing import List, Optional
import uuid
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from server import crud, schemas
from server.database import get_db

router = APIRouter()


@router.post(
    "/expenses",
    response_model=schemas.ExpenseResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_expense(expense_in: schemas.ExpenseCreate, db: Session = Depends(get_db)):
    if expense_in.amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Expense amount must be positive",
        )
    return crud.create_expense(db, expense_in)


@router.get("/expenses", response_model=List[schemas.ExpenseResponse])
def get_expenses(
    month: Optional[str] = Query(
        None, description="Filter expenses by month in YYYY-MM format"
    ),
    start_date: Optional[date] = Query(
        None, description="Start date filter YYYY-MM-DD"
    ),
    end_date: Optional[date] = Query(None, description="End date filter YYYY-MM-DD"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    return crud.get_expenses(
        db=db,
        month=month,
        start_date=start_date,
        end_date=end_date,
        skip=skip,
        limit=limit,
    )


@router.get("/expenses/{expense_id}", response_model=schemas.ExpenseResponse)
def get_expense(expense_id: uuid.UUID, db: Session = Depends(get_db)):
    expense = crud.get_expense(db, expense_id)
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found"
        )
    return expense


@router.put("/expenses/{expense_id}", response_model=schemas.ExpenseResponse)
def update_expense(
    expense_id: uuid.UUID,
    expense_in: schemas.ExpenseUpdate,
    db: Session = Depends(get_db),
):
    if expense_in.amount is not None and expense_in.amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Expense amount must be positive",
        )
    expense = crud.update_expense(db, expense_id, expense_in)
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found"
        )
    return expense


@router.delete("/expenses/{expense_id}", status_code=status.HTTP_200_OK)
def delete_expense(expense_id: uuid.UUID, db: Session = Depends(get_db)):
    success = crud.delete_expense(db, expense_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found"
        )
    return {"message": "Expense deleted successfully"}


@router.get("/dashboard/summary", response_model=schemas.DashboardSummaryResponse)
def get_dashboard_summary(
    month: Optional[str] = Query(
        None, description="Active month filter in YYYY-MM format"
    ),
    db: Session = Depends(get_db),
):
    return crud.get_dashboard_summary(db, month=month)
