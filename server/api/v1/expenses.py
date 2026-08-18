from datetime import date
from typing import Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.schemas.expense import (
    ExpenseCreate,
    ExpenseUpdate,
    ExpenseResponse,
    ExpenseListResponse,
    ExpenseSummaryResponse,
)
from server.services import expense_service

router = APIRouter(prefix="/expenses", tags=["Expenses"])


@router.get("/summary", response_model=ExpenseSummaryResponse, status_code=status.HTTP_200_OK)
def get_expense_summary(
    start_date: Optional[date] = Query(None, description="Start date filter (YYYY-MM-DD)"),
    end_date: Optional[date] = Query(None, description="End date filter (YYYY-MM-DD)"),
    db: Session = Depends(get_db),
):
    return expense_service.get_expense_summary(db, start_date=start_date, end_date=end_date)


@router.post("", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
def create_expense(expense_in: ExpenseCreate, db: Session = Depends(get_db)):
    return expense_service.create_expense(db, expense_in)


@router.get("", response_model=ExpenseListResponse, status_code=status.HTTP_200_OK)
def list_expenses(
    category_id: Optional[str] = Query(None, description="Filter by category UUID"),
    start_date: Optional[date] = Query(None, description="Filter from start date (YYYY-MM-DD)"),
    end_date: Optional[date] = Query(None, description="Filter to end date (YYYY-MM-DD)"),
    search: Optional[str] = Query(None, description="Search description or payment method"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return expense_service.get_expenses(
        db,
        category_id=category_id,
        start_date=start_date,
        end_date=end_date,
        search=search,
        skip=skip,
        limit=limit,
    )


@router.get("/{expense_id}", response_model=ExpenseResponse, status_code=status.HTTP_200_OK)
def get_expense(expense_id: str, db: Session = Depends(get_db)):
    return expense_service.get_expense_by_id(db, expense_id)


@router.put("/{expense_id}", response_model=ExpenseResponse, status_code=status.HTTP_200_OK)
def update_expense(expense_id: str, expense_in: ExpenseUpdate, db: Session = Depends(get_db)):
    return expense_service.update_expense(db, expense_id, expense_in)


@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_expense(expense_id: str, db: Session = Depends(get_db)):
    expense_service.delete_expense(db, expense_id)
    return None
