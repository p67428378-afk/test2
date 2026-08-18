from datetime import date
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from server import crud, schemas
from server.database import get_db

router = APIRouter(prefix="/expenses", tags=["Expenses"])


def _to_expense_response(expense) -> schemas.ExpenseResponse:
    category_name = expense.category.name if expense.category else None
    return schemas.ExpenseResponse(
        id=expense.id,
        amount=expense.amount,
        date=expense.date,
        category_id=expense.category_id,
        category_name=category_name,
        payment_method=expense.payment_method,
        description=expense.description,
        created_at=expense.created_at,
        updated_at=expense.updated_at
    )


@router.get("/summary", response_model=schemas.ExpenseSummaryResponse)
def get_expense_summary(
    start_date: Optional[date] = Query(None, description="Start date filter (YYYY-MM-DD)"),
    end_date: Optional[date] = Query(None, description="End date filter (YYYY-MM-DD)"),
    category_id: Optional[str] = Query(None, description="Category UUID filter"),
    db: Session = Depends(get_db)
):
    """Get aggregated expense summary statistics."""
    return crud.get_expense_summary(db, start_date=start_date, end_date=end_date, category_id=category_id)


@router.get("", response_model=List[schemas.ExpenseResponse])
@router.get("/", response_model=List[schemas.ExpenseResponse])
def list_expenses(
    category_id: Optional[str] = Query(None, description="Filter by category UUID"),
    start_date: Optional[date] = Query(None, description="Start date filter"),
    end_date: Optional[date] = Query(None, description="End date filter"),
    search: Optional[str] = Query(None, description="Search in description or payment method"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Retrieve list of expenses with optional filtering and pagination."""
    expenses = crud.get_expenses(
        db,
        category_id=category_id,
        start_date=start_date,
        end_date=end_date,
        search=search,
        skip=skip,
        limit=limit
    )
    return [_to_expense_response(e) for e in expenses]


@router.post("", response_model=schemas.ExpenseResponse, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=schemas.ExpenseResponse, status_code=status.HTTP_201_CREATED)
def create_expense(expense_in: schemas.ExpenseCreate, db: Session = Depends(get_db)):
    """Record a new expense."""
    category = crud.get_category_by_id(db, expense_in.category_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with ID '{expense_in.category_id}' not found."
        )

    expense = crud.create_expense(db, expense_in)
    return _to_expense_response(expense)


@router.get("/{expense_id}", response_model=schemas.ExpenseResponse)
def get_expense(expense_id: str, db: Session = Depends(get_db)):
    """Get specific expense details by UUID."""
    expense = crud.get_expense_by_id(db, expense_id)
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Expense with ID '{expense_id}' not found."
        )
    return _to_expense_response(expense)


@router.put("/{expense_id}", response_model=schemas.ExpenseResponse)
def update_expense(expense_id: str, expense_update: schemas.ExpenseUpdate, db: Session = Depends(get_db)):
    """Update an existing expense record."""
    if expense_update.category_id is not None:
        category = crud.get_category_by_id(db, expense_update.category_id)
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Category with ID '{expense_update.category_id}' not found."
            )

    expense = crud.update_expense(db, expense_id, expense_update)
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Expense with ID '{expense_id}' not found."
        )
    return _to_expense_response(expense)


@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_expense(expense_id: str, db: Session = Depends(get_db)):
    """Delete an expense record."""
    success = crud.delete_expense(db, expense_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Expense with ID '{expense_id}' not found."
        )
    return None
