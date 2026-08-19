from datetime import datetime
from typing import List, Tuple, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from server.models.task import Task
from server.models.user import User
from server.models.cost_log import CostLog
from server.schemas.task import TaskCreate, TaskUpdate


def create_task(db: Session, task_in: TaskCreate) -> Task:
    if not task_in.title or not task_in.title.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Task title is required",
        )
    if not task_in.location_equipment or not task_in.location_equipment.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Location/Equipment is required",
        )
    if task_in.estimated_cost < 0:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Estimated cost cannot be negative",
        )

    if task_in.assigned_to_id:
        tech = db.query(User).filter(User.id == task_in.assigned_to_id).first()
        if not tech or not tech.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Assigned technician is inactive or does not exist",
            )

    db_task = Task(
        title=task_in.title,
        description=task_in.description,
        location_equipment=task_in.location_equipment,
        priority=task_in.priority,
        status="Pending",
        estimated_cost=task_in.estimated_cost,
        actual_cost=0.0,
        due_date=task_in.due_date,
        assigned_to_id=task_in.assigned_to_id,
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)

    if task_in.estimated_cost > 0:
        cost_log = CostLog(
            task_id=db_task.id,
            cost_type="Estimated",
            amount=task_in.estimated_cost,
            notes="Initial estimated cost",
        )
        db.add(cost_log)
        db.commit()

    return db_task


def get_tasks(
    db: Session,
    skip: int = 0,
    limit: int = 20,
    status_filter: Optional[str] = None,
    priority_filter: Optional[str] = None,
    assigned_to_id: Optional[str] = None,
) -> Tuple[List[Task], int]:
    query = db.query(Task)
    if status_filter:
        query = query.filter(Task.status == status_filter)
    if priority_filter:
        query = query.filter(Task.priority == priority_filter)
    if assigned_to_id:
        query = query.filter(Task.assigned_to_id == assigned_to_id)

    total = query.count()
    items = query.offset(skip).limit(limit).all()
    return items, total


def get_task_by_id(db: Session, task_id: str) -> Optional[Task]:
    return db.query(Task).filter(Task.id == task_id).first()


def update_task(db: Session, task: Task, task_in: TaskUpdate) -> Task:
    update_data = task_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(task, field, value)
    db.commit()
    db.refresh(task)
    return task


def assign_task(db: Session, task: Task, assigned_to_id: str) -> Task:
    tech = db.query(User).filter(User.id == assigned_to_id).first()
    if not tech or not tech.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Assigned technician is inactive or does not exist",
        )
    task.assigned_to_id = assigned_to_id
    db.commit()
    db.refresh(task)
    return task


def complete_task(
    db: Session, task: Task, actual_cost: float, resolution_notes: str
) -> Task:
    if actual_cost < 0:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Actual cost cannot be negative",
        )
    if not resolution_notes or not resolution_notes.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Resolution notes are required to complete task",
        )

    task.status = "Completed"
    task.actual_cost = actual_cost
    task.resolution_notes = resolution_notes
    task.completed_at = datetime.utcnow()

    cost_log = CostLog(
        task_id=task.id, cost_type="Actual", amount=actual_cost, notes=resolution_notes
    )
    db.add(cost_log)

    db.commit()
    db.refresh(task)
    return task


def delete_task(db: Session, task: Task) -> None:
    db.delete(task)
    db.commit()
