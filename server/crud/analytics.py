from datetime import date, datetime
from typing import List, Optional
import calendar
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from server.models.expense import Expense
from server.models.budget import Budget
from server.models.category import Category
from server.schemas.analytics import (
    AnalyticsSummary,
    CategoryBreakdownItem,
    MonthlyTrendItem,
)


def get_analytics_summary(
    db: Session,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    month: Optional[int] = None,
    year: Optional[int] = None,
) -> AnalyticsSummary:
    now = datetime.now()
    target_year = year or now.year
    target_month = month or now.month

    # Filter expenses
    exp_query = db.query(Expense)
    if start_date:
        exp_query = exp_query.filter(Expense.expense_date >= start_date)
    if end_date:
        exp_query = exp_query.filter(Expense.expense_date <= end_date)
    if not start_date and not end_date:
        if month:
            exp_query = exp_query.filter(
                extract("month", Expense.expense_date) == month
            )
        if year:
            exp_query = exp_query.filter(extract("year", Expense.expense_date) == year)

    expenses = exp_query.all()
    total_spent = sum(e.amount for e in expenses)
    transaction_count = len(expenses)

    # Calculate days for daily average
    if start_date and end_date:
        delta_days = (end_date - start_date).days + 1
        days_count = max(delta_days, 1)
    elif month and year:
        _, days_count = calendar.monthrange(year, month)
    else:
        # Use days in target month
        _, days_count = calendar.monthrange(target_year, target_month)

    daily_average = round(total_spent / days_count, 2) if days_count > 0 else 0.0

    # Budget limits for the month/year
    budget_query = db.query(Budget)
    if month:
        budget_query = budget_query.filter(Budget.month == month)
    elif not start_date and not end_date:
        budget_query = budget_query.filter(Budget.month == target_month)

    if year:
        budget_query = budget_query.filter(Budget.year == year)
    elif not start_date and not end_date:
        budget_query = budget_query.filter(Budget.year == target_year)

    budgets = budget_query.all()
    monthly_budget_limit = sum(b.monthly_limit for b in budgets)
    remaining_balance = round(monthly_budget_limit - total_spent, 2)

    # Over limit categories
    # Calculate spending per category
    cat_spending = {}
    for e in expenses:
        cat_spending[e.category_id] = cat_spending.get(e.category_id, 0.0) + e.amount

    over_limit_categories = []
    for b in budgets:
        spent = cat_spending.get(b.category_id, 0.0)
        if spent > b.monthly_limit:
            cat = db.query(Category).filter(Category.id == b.category_id).first()
            if cat:
                over_limit_categories.append(cat.name)

    return AnalyticsSummary(
        total_spent=round(total_spent, 2),
        monthly_budget_limit=round(monthly_budget_limit, 2),
        remaining_balance=remaining_balance,
        daily_average=daily_average,
        transaction_count=transaction_count,
        categories_over_limit_count=len(over_limit_categories),
        over_limit_categories=over_limit_categories,
    )


def get_category_breakdown(
    db: Session,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    month: Optional[int] = None,
    year: Optional[int] = None,
) -> List[CategoryBreakdownItem]:
    exp_query = db.query(Expense)
    if start_date:
        exp_query = exp_query.filter(Expense.expense_date >= start_date)
    if end_date:
        exp_query = exp_query.filter(Expense.expense_date <= end_date)
    if not start_date and not end_date:
        if month:
            exp_query = exp_query.filter(
                extract("month", Expense.expense_date) == month
            )
        if year:
            exp_query = exp_query.filter(extract("year", Expense.expense_date) == year)

    expenses = exp_query.all()
    total_spent = sum(e.amount for e in expenses)

    cat_map = {}
    categories = db.query(Category).all()
    for cat in categories:
        cat_map[cat.id] = {
            "name": cat.name,
            "color": cat.color,
            "total": 0.0,
            "count": 0,
        }

    for e in expenses:
        if e.category_id in cat_map:
            cat_map[e.category_id]["total"] += e.amount
            cat_map[e.category_id]["count"] += 1

    results = []
    for cat_id, data in cat_map.items():
        if data["count"] > 0 or len(expenses) == 0:
            pct = (
                round((data["total"] / total_spent * 100), 2)
                if total_spent > 0
                else 0.0
            )
            results.append(
                CategoryBreakdownItem(
                    category_id=cat_id,
                    category_name=data["name"],
                    category_color=data["color"],
                    total_amount=round(data["total"], 2),
                    percentage=pct,
                    transaction_count=data["count"],
                )
            )

    results.sort(key=lambda x: x.total_amount, reverse=True)
    return results


def get_monthly_trend(db: Session, months: int = 6) -> List[MonthlyTrendItem]:
    now = datetime.now()
    results = []

    for i in range(months - 1, -1, -1):
        # calculate target month & year
        m = (now.month - i - 1) % 12 + 1
        y = now.year + ((now.month - i - 1) // 12)
        month_name = calendar.month_abbr[m]
        period = f"{month_name} {y}"

        # Get expenses for that month & year
        month_exp = (
            db.query(
                func.coalesce(func.sum(Expense.amount), 0.0),
                func.count(Expense.id),
            )
            .filter(
                extract("month", Expense.expense_date) == m,
                extract("year", Expense.expense_date) == y,
            )
            .first()
        )
        total_spent = float(month_exp[0] or 0.0)
        tx_count = int(month_exp[1] or 0)

        # Get budget limit for that month & year
        budget_sum = (
            db.query(func.coalesce(func.sum(Budget.monthly_limit), 0.0))
            .filter(Budget.month == m, Budget.year == y)
            .scalar()
        )
        b_limit = float(budget_sum or 0.0)

        results.append(
            MonthlyTrendItem(
                month=m,
                year=y,
                period=period,
                total_amount=round(total_spent, 2),
                budget_limit=round(b_limit, 2),
                transaction_count=tx_count,
            )
        )

    return results
