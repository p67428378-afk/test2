from sqlalchemy.orm import Session
from sqlalchemy import func
from server.models import Task
from server.schemas import TaskCreate, TaskUpdate
from uuid import UUID
from datetime import datetime, timezone


def get_tasks(db: Session, skip: int = 0, limit: int = 100):
    return (
        db.query(Task)
        .order_by(Task.position.asc(), Task.created_at.asc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def create_task(db: Session, task_in: TaskCreate):
    # Get the max position to place the new task at the end
    max_pos = db.query(func.max(Task.position)).scalar()
    next_pos = (max_pos + 1) if max_pos is not None else 0

    db_task = Task(text=task_in.text, is_completed=False, position=next_pos)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def update_task(db: Session, task_id: UUID, task_in: TaskUpdate):
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        return None

    update_data = task_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_task, field, value)

    db_task.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(db_task)
    return db_task


def delete_task(db: Session, task_id: UUID):
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        return False
    db.delete(db_task)
    db.commit()
    return True


def reorder_tasks(db: Session, task_ids: list):
    # Update positions based on the order of IDs in the list
    for index, task_id in enumerate(task_ids):
        db.query(Task).filter(Task.id == task_id).update(
            {Task.position: index, Task.updated_at: datetime.now(timezone.utc)}
        )
    db.commit()
    return True
