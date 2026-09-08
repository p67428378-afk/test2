import uuid
import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from server.models.expense import Expense
from server.schemas.expense import ExpenseCreate, ExpenseUpdate


def create_expense(db: Session, expense_in: ExpenseCreate) -> Expense:
    expense = Expense(
        amount=expense_in.amount,
        category=expense_in.category,
        date=expense_in.date,
        description=expense_in.description,
    )
    db.add(expense)
    db.commit()
    db.refresh(expense)
    return expense


def get_expense(db: Session, expense_id: uuid.UUID) -> Optional[Expense]:
    return db.query(Expense).filter(Expense.id == expense_id).first()


def list_expenses(
    db: Session,
    skip: int = 0,
    limit: int = 20,
    search: Optional[str] = None,
    category: Optional[str] = None,
    start_date: Optional[datetime.date] = None,
    end_date: Optional[datetime.date] = None,
    sort_by: str = "date",
    sort_order: str = "desc",
) -> List[Expense]:
    query = db.query(Expense)

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                Expense.category.ilike(search_pattern),
                Expense.description.ilike(search_pattern),
            )
        )

    if category and category.lower() != "all categories":
        query = query.filter(Expense.category == category)

    if start_date:
        query = query.filter(Expense.date >= start_date)

    if end_date:
        query = query.filter(Expense.date <= end_date)

    # Sorting
    sort_column = getattr(Expense, sort_by, Expense.date)
    if sort_order.lower() == "desc":
        query = query.order_by(sort_column.desc(), Expense.created_at.desc())
    else:
        query = query.order_by(sort_column.asc(), Expense.created_at.asc())

    return query.offset(skip).limit(limit).all()


def count_expenses(
    db: Session,
    search: Optional[str] = None,
    category: Optional[str] = None,
    start_date: Optional[datetime.date] = None,
    end_date: Optional[datetime.date] = None,
) -> int:
    query = db.query(func.count(Expense.id))

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                Expense.category.ilike(search_pattern),
                Expense.description.ilike(search_pattern),
            )
        )

    if category and category.lower() != "all categories":
        query = query.filter(Expense.category == category)

    if start_date:
        query = query.filter(Expense.date >= start_date)

    if end_date:
        query = query.filter(Expense.date <= end_date)

    return query.scalar() or 0


def update_expense(
    db: Session, expense_id: uuid.UUID, expense_in: ExpenseUpdate
) -> Optional[Expense]:
    expense = get_expense(db, expense_id)
    if not expense:
        return None

    update_data = expense_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(expense, field, value)

    expense.updated_at = datetime.datetime.now(datetime.timezone.utc)
    db.commit()
    db.refresh(expense)
    return expense


def delete_expense(db: Session, expense_id: uuid.UUID) -> bool:
    expense = get_expense(db, expense_id)
    if not expense:
        return False

    db.delete(expense)
    db.commit()
    return True
