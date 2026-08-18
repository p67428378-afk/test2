from datetime import date, datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func, or_

from server.models import Category, Expense
from server import schemas


# Category CRUD
def get_categories(db: Session) -> List[Category]:
    return db.query(Category).order_by(Category.name.asc()).all()


def get_category_by_id(db: Session, category_id: str) -> Optional[Category]:
    return db.query(Category).filter(Category.id == category_id).first()


def get_category_by_name(db: Session, name: str) -> Optional[Category]:
    return db.query(Category).filter(func.lower(Category.name) == func.lower(name)).first()


def create_category(db: Session, category: schemas.CategoryCreate) -> Category:
    db_category = Category(
        name=category.name.strip(),
        description=category.description
    )
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category


# Expense CRUD
def get_expenses(
    db: Session,
    category_id: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 50
) -> List[Expense]:
    query = db.query(Expense)

    if category_id:
        query = query.filter(Expense.category_id == category_id)
    if start_date:
        query = query.filter(Expense.date >= start_date)
    if end_date:
        query = query.filter(Expense.date <= end_date)
    if search:
        search_pattern = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Expense.description.ilike(search_pattern),
                Expense.payment_method.ilike(search_pattern)
            )
        )

    return query.order_by(Expense.date.desc(), Expense.created_at.desc()).offset(skip).limit(limit).all()


def get_expense_by_id(db: Session, expense_id: str) -> Optional[Expense]:
    return db.query(Expense).filter(Expense.id == expense_id).first()


def create_expense(db: Session, expense: schemas.ExpenseCreate) -> Expense:
    db_expense = Expense(
        amount=expense.amount,
        date=expense.date,
        category_id=expense.category_id,
        payment_method=expense.payment_method,
        description=expense.description
    )
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense


def update_expense(db: Session, expense_id: str, expense_update: schemas.ExpenseUpdate) -> Optional[Expense]:
    db_expense = get_expense_by_id(db, expense_id)
    if not db_expense:
        return None

    update_data = expense_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_expense, field, value)

    db_expense.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_expense)
    return db_expense


def delete_expense(db: Session, expense_id: str) -> bool:
    db_expense = get_expense_by_id(db, expense_id)
    if not db_expense:
        return False

    db.delete(db_expense)
    db.commit()
    return True


def get_expense_summary(
    db: Session,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    category_id: Optional[str] = None
) -> schemas.ExpenseSummaryResponse:
    query = db.query(Expense)

    if category_id:
        query = query.filter(Expense.category_id == category_id)
    if start_date:
        query = query.filter(Expense.date >= start_date)
    if end_date:
        query = query.filter(Expense.date <= end_date)

    expenses = query.all()
    total_expense = sum(e.amount for e in expenses)
    total_transactions = len(expenses)

    # Group by category
    categories_map = {}
    for e in expenses:
        cat_id = e.category_id
        if cat_id not in categories_map:
            cat_name = e.category.name if e.category else "Uncategorized"
            categories_map[cat_id] = {
                "category_id": cat_id,
                "category_name": cat_name,
                "total": 0.0,
                "count": 0
            }
        categories_map[cat_id]["total"] += e.amount
        categories_map[cat_id]["count"] += 1

    by_category = []
    for cat_info in categories_map.values():
        percentage = round((cat_info["total"] / total_expense * 100), 2) if total_expense > 0 else 0.0
        by_category.append(
            schemas.CategorySummaryItem(
                category_id=cat_info["category_id"],
                category_name=cat_info["category_name"],
                total=round(cat_info["total"], 2),
                count=cat_info["count"],
                percentage=percentage
            )
        )

    # Sort categories by total descending
    by_category.sort(key=lambda x: x.total, reverse=True)

    return schemas.ExpenseSummaryResponse(
        total_expense=round(total_expense, 2),
        total_transactions=total_transactions,
        start_date=start_date.isoformat() if start_date else None,
        end_date=end_date.isoformat() if end_date else None,
        by_category=by_category
    )
