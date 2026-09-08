import uuid
import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.schemas.expense import ExpenseCreate, ExpenseUpdate, ExpenseResponse
from server.services import expense_service

router = APIRouter()


@router.post("", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
def create_expense_endpoint(expense_in: ExpenseCreate, db: Session = Depends(get_db)):
    return expense_service.create_expense(db=db, expense_in=expense_in)


@router.get("", response_model=List[ExpenseResponse])
@router.get("/", response_model=List[ExpenseResponse])
def list_expenses_endpoint(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    start_date: Optional[datetime.date] = Query(None),
    end_date: Optional[datetime.date] = Query(None),
    sort_by: str = Query("date"),
    sort_order: str = Query("desc"),
    db: Session = Depends(get_db),
):
    return expense_service.list_expenses(
        db=db,
        skip=skip,
        limit=limit,
        search=search,
        category=category,
        start_date=start_date,
        end_date=end_date,
        sort_by=sort_by,
        sort_order=sort_order,
    )


@router.get("/{expense_id}", response_model=ExpenseResponse)
def get_expense_endpoint(expense_id: uuid.UUID, db: Session = Depends(get_db)):
    expense = expense_service.get_expense(db=db, expense_id=expense_id)
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found"
        )
    return expense


@router.put("/{expense_id}", response_model=ExpenseResponse)
def update_expense_endpoint(
    expense_id: uuid.UUID, expense_in: ExpenseUpdate, db: Session = Depends(get_db)
):
    updated_expense = expense_service.update_expense(
        db=db, expense_id=expense_id, expense_in=expense_in
    )
    if not updated_expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found"
        )
    return updated_expense


@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_expense_endpoint(expense_id: uuid.UUID, db: Session = Depends(get_db)):
    deleted = expense_service.delete_expense(db=db, expense_id=expense_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found"
        )
    return None
