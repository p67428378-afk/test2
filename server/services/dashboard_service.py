from sqlalchemy.orm import Session
from sqlalchemy import func
from server.models.expense import Expense
from server.schemas.dashboard import DashboardSummary, CategoryBreakdown


def get_dashboard_summary(db: Session) -> DashboardSummary:
    # 1. Total expenses and count
    total_stats = db.query(
        func.coalesce(func.sum(Expense.amount), 0.0).label("total_amount"),
        func.count(Expense.id).label("total_count"),
    ).first()

    total_expenses = float(total_stats.total_amount) if total_stats else 0.0
    total_count = int(total_stats.total_count) if total_stats else 0

    # 2. Category breakdown
    category_rows = (
        db.query(
            Expense.category,
            func.coalesce(func.sum(Expense.amount), 0.0).label("cat_total"),
            func.count(Expense.id).label("cat_count"),
        )
        .group_by(Expense.category)
        .order_by(func.sum(Expense.amount).desc())
        .all()
    )

    by_category = []
    top_category = None
    max_cat_amount = -1.0

    for row in category_rows:
        cat_name = row.category
        cat_total = float(row.cat_total)
        cat_count = int(row.cat_count)
        percentage = (
            round((cat_total / total_expenses * 100.0), 2)
            if total_expenses > 0
            else 0.0
        )

        if cat_total > max_cat_amount:
            max_cat_amount = cat_total
            top_category = cat_name

        by_category.append(
            CategoryBreakdown(
                category=cat_name,
                total_amount=round(cat_total, 2),
                count=cat_count,
                percentage=percentage,
            )
        )

    # 3. Monthly average calculation
    # Count distinct YYYY-MM periods from expenses
    distinct_months_count = (
        db.query(
            func.count(func.distinct(func.strftime("%Y-%m", Expense.date)))
        ).scalar()
        or 0
    )

    if distinct_months_count <= 0:
        monthly_average = round(total_expenses, 2)
    else:
        monthly_average = round(total_expenses / distinct_months_count, 2)

    return DashboardSummary(
        total_expenses=round(total_expenses, 2),
        total_count=total_count,
        monthly_average=monthly_average,
        top_category=top_category,
        expense_count=total_count,
        by_category=by_category,
        category_breakdown=by_category,
    )
