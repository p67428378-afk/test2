from datetime import date
from typing import Optional, List
from sqlalchemy.orm import Session

from server.models.task import Task
from server.models.category import Category
from server.schemas.cost import CostSummaryResponse, CategoryCostBreakdown


def get_cost_summary(
    db: Session,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    category_id: Optional[str] = None,
) -> CostSummaryResponse:
    query = db.query(Task)

    if start_date:
        query = query.filter(Task.due_date >= start_date)
    if end_date:
        query = query.filter(Task.due_date <= end_date)
    if category_id:
        query = query.filter(Task.category_id == category_id)

    tasks = query.all()

    categories = db.query(Category).all()
    cat_map = {c.id: c.name for c in categories}

    category_stats = {}
    total_estimated = 0.0
    total_actual = 0.0

    for task in tasks:
        est = task.estimated_cost or 0.0
        act = (
            task.actual_cost
            if task.actual_cost is not None
            else (est if task.status == "Completed" else 0.0)
        )

        total_estimated += est
        total_actual += act

        c_id = task.category_id
        c_name = cat_map.get(c_id, "Unknown")

        if c_id not in category_stats:
            category_stats[c_id] = {
                "category_id": c_id,
                "category_name": c_name,
                "estimated": 0.0,
                "actual": 0.0,
            }

        category_stats[c_id]["estimated"] += est
        category_stats[c_id]["actual"] += act

    breakdown: List[CategoryCostBreakdown] = []
    for c_id, stats in category_stats.items():
        var = stats["actual"] - stats["estimated"]
        breakdown.append(
            CategoryCostBreakdown(
                category_id=stats["category_id"],
                category_name=stats["category_name"],
                estimated=round(stats["estimated"], 2),
                actual=round(stats["actual"], 2),
                variance=round(var, 2),
            )
        )

    overall_variance = total_actual - total_estimated

    return CostSummaryResponse(
        total_estimated=round(total_estimated, 2),
        total_actual=round(total_actual, 2),
        variance=round(overall_variance, 2),
        category_breakdown=breakdown,
    )
