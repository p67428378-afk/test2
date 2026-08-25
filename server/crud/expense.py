import uuid
from datetime import date, datetime, timezone
from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from server.models.expense import Expense
from server.schemas.expense import ExpenseCreate, ExpenseUpdate


def get_expenses(
    db: Session,
    skip: int = 0,
    limit: int = 20,
    category_id: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    payment_method: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: Optional[str] = "date_desc",
) -> List[Expense]:
    query = db.query(Expense).options(joinedload(Expense.category))

    if category_id:
        query = query.filter(Expense.category_id == category_id)
    if start_date:
        query = query.filter(Expense.expense_date >= start_date)
    if end_date:
        query = query.filter(Expense.expense_date <= end_date)
    if (
        payment_method
        and payment_method.lower() != "all"
        and payment_method.lower() != "all methods"
    ):
        query = query.filter(Expense.payment_method == payment_method)
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                Expense.title.ilike(search_pattern),
                Expense.description.ilike(search_pattern),
            )
        )

    if sort_by == "date_asc":
        query = query.order_by(Expense.expense_date.asc(), Expense.created_at.asc())
    elif sort_by == "amount_desc":
        query = query.order_by(Expense.amount.desc())
    elif sort_by == "amount_asc":
        query = query.order_by(Expense.amount.asc())
    else:  # default date_desc
        query = query.order_by(Expense.expense_date.desc(), Expense.created_at.desc())

    return query.offset(skip).limit(limit).all()


def get_expense(db: Session, expense_id: str) -> Optional[Expense]:
    return (
        db.query(Expense)
        .options(joinedload(Expense.category))
        .filter(Expense.id == expense_id)
        .first()
    )


def create_expense(db: Session, expense_in: ExpenseCreate) -> Expense:
    exp = Expense(
        id=str(uuid.uuid4()),
        title=expense_in.title,
        amount=expense_in.amount,
        category_id=expense_in.category_id,
        expense_date=expense_in.expense_date,
        payment_method=expense_in.payment_method,
        description=expense_in.description,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.add(exp)
    db.commit()
    db.refresh(exp)
    return exp


def update_expense(db: Session, expense: Expense, expense_in: ExpenseUpdate) -> Expense:
    update_data = expense_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(expense, field, value)
    expense.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(expense)
    return expense


def delete_expense(db: Session, expense: Expense) -> None:
    db.delete(expense)
    db.commit()
