from sqlalchemy.orm import Session
from sqlalchemy import or_
from datetime import datetime
from typing import Optional
from server.models import User, Task
from server.schemas import UserSignUp, TaskCreate, TaskUpdate
from server.auth import get_password_hash, verify_password


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def create_user(db: Session, user_in: UserSignUp):
    hashed_password = get_password_hash(user_in.password)
    db_user = User(email=user_in.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def create_task(db: Session, task_in: TaskCreate, user_id: str):
    db_task = Task(
        user_id=user_id,
        title=task_in.title,
        description=task_in.description,
        status=task_in.status,
        priority=task_in.priority,
        due_date=task_in.due_date,
        tags=task_in.tags,
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def get_task(db: Session, task_id: str, user_id: str):
    return db.query(Task).filter(Task.id == task_id, Task.user_id == user_id).first()


def get_tasks(
    db: Session,
    user_id: str,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    tag: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: Optional[str] = None,
    order: str = "asc",
    skip: int = 0,
    limit: int = 20,
):
    query = db.query(Task).filter(Task.user_id == user_id)

    if status:
        query = query.filter(Task.status == status)
    if priority:
        query = query.filter(Task.priority == priority)
    if tag:
        # SQLite JSON contains check or simple string match
        # Since tags is a JSON array, we can filter using a custom function or simple like
        # For SQLite, we can do a simple check:
        query = query.filter(Task.tags.like(f'%"{tag}"%'))

    if search:
        query = query.filter(
            or_(Task.title.ilike(f"%{search}%"), Task.description.ilike(f"%{search}%"))
        )

    # Sorting
    if sort_by:
        col = getattr(Task, sort_by, None)
        if col is not None:
            if order.lower() == "desc":
                query = query.order_by(col.desc())
            else:
                query = query.order_by(col.asc())
    else:
        query = query.order_by(Task.created_at.desc())

    total = query.count()
    items = query.offset(skip).limit(limit).all()
    return items, total


def update_task(db: Session, db_task: Task, task_in: TaskUpdate):
    update_data = task_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_task, field, value)
    db.commit()
    db.refresh(db_task)
    return db_task


def delete_task(db: Session, db_task: Task):
    db.delete(db_task)
    db.commit()


def get_dashboard_stats(db: Session, user_id: str):
    now = datetime.utcnow()

    total_tasks = db.query(Task).filter(Task.user_id == user_id).count()
    completed_tasks = (
        db.query(Task)
        .filter(Task.user_id == user_id, Task.status == "Completed")
        .count()
    )
    in_progress_tasks = (
        db.query(Task)
        .filter(Task.user_id == user_id, Task.status == "In Progress")
        .count()
    )

    # Overdue tasks: status != 'Completed' and due_date < now
    overdue_tasks = (
        db.query(Task)
        .filter(
            Task.user_id == user_id,
            Task.status != "Completed",
            Task.due_date.isnot(None),
            Task.due_date < now,
        )
        .count()
    )

    completion_rate = 0.0
    if total_tasks > 0:
        completion_rate = round((completed_tasks / total_tasks) * 100, 2)

    return {
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "in_progress_tasks": in_progress_tasks,
        "overdue_tasks": overdue_tasks,
        "completion_rate": completion_rate,
    }
