from datetime import datetime, timedelta, date
from typing import Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from server.models.task import Task
from server.models.task_assignment import TaskAssignment
from server.models.completion_log import CompletionLog
from server.schemas.completion import CompletionLogCreate, TaskCompletionResponse


def calculate_next_due_date(base_date: date, frequency: str) -> date:
    freq_lower = frequency.lower()
    if freq_lower == "weekly":
        return base_date + timedelta(days=7)
    elif freq_lower == "monthly":
        return base_date + timedelta(days=30)
    elif freq_lower == "quarterly":
        return base_date + timedelta(days=90)
    elif freq_lower == "annual":
        return base_date + timedelta(days=365)
    return base_date


def complete_task(
    db: Session, task_id: str, completion_in: CompletionLogCreate, current_user_id: str
) -> TaskCompletionResponse:
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with id {task_id} not found",
        )

    completed_at = completion_in.completed_at or datetime.utcnow()

    # Actual cost defaults to estimated_cost or 0.0 if not provided
    if completion_in.actual_cost is not None:
        actual_cost = completion_in.actual_cost
    else:
        actual_cost = task.estimated_cost if task.estimated_cost is not None else 0.0

    task.status = "Completed"
    task.actual_cost = actual_cost
    task.updated_at = datetime.utcnow()

    next_task_id: Optional[str] = None

    # Handle recurring tasks
    if task.frequency and task.frequency != "One-time":
        base_due_date = task.due_date if task.due_date else completed_at.date()
        next_due_date = calculate_next_due_date(base_due_date, task.frequency)

        next_task = Task(
            title=task.title,
            description=task.description,
            category_id=task.category_id,
            priority=task.priority,
            estimated_cost=task.estimated_cost,
            frequency=task.frequency,
            due_date=next_due_date,
            status="Pending",
            created_by=current_user_id,
            assigned_user_id=task.assigned_user_id,
        )
        db.add(next_task)
        db.flush()
        next_task_id = next_task.id

        if task.assigned_user_id:
            assignment = TaskAssignment(
                task_id=next_task.id,
                assigned_to=task.assigned_user_id,
                assigned_by=current_user_id,
                status="Active",
            )
            db.add(assignment)

    log = CompletionLog(
        task_id=task.id,
        completed_by=current_user_id,
        completed_at=completed_at,
        actual_cost=actual_cost,
        notes=completion_in.notes,
        receipt_reference=completion_in.receipt_reference,
        next_task_id=next_task_id,
    )
    db.add(log)

    db.commit()

    return TaskCompletionResponse(
        log_id=log.id,
        task_id=task.id,
        status="Completed",
        actual_cost=actual_cost,
        next_task_id=next_task_id,
    )


def get_task_completion_logs(db: Session, task_id: str):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with id {task_id} not found",
        )
    return (
        db.query(CompletionLog)
        .filter(CompletionLog.task_id == task_id)
        .order_by(CompletionLog.completed_at.desc())
        .all()
    )
