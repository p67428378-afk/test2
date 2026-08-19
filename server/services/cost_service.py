from sqlalchemy.orm import Session
from server.models.task import Task
from server.schemas.cost_log import CostSummaryResponse


def get_cost_summary(db: Session) -> CostSummaryResponse:
    tasks = db.query(Task).all()

    total_estimated_cost = sum(t.estimated_cost or 0.0 for t in tasks)
    total_actual_cost = sum(t.actual_cost or 0.0 for t in tasks)
    cost_variance = total_actual_cost - total_estimated_cost

    completed_tasks_count = sum(1 for t in tasks if t.status == "Completed")
    pending_tasks_count = sum(
        1 for t in tasks if t.status in ("Pending", "In Progress")
    )

    return CostSummaryResponse(
        total_estimated_cost=round(total_estimated_cost, 2),
        total_actual_cost=round(total_actual_cost, 2),
        cost_variance=round(cost_variance, 2),
        completed_tasks_count=completed_tasks_count,
        pending_tasks_count=pending_tasks_count,
    )
