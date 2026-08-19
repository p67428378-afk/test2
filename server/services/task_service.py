from datetime import date, datetime
from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from server.models.task import Task
from server.models.task_assignment import TaskAssignment
from server.models.category import Category
from server.models.user import User
from server.schemas.task import TaskCreate, TaskUpdate, TaskAssignRequest


def update_overdue_statuses(db: Session, tasks: List[Task]):
    today = date.today()
    modified = False
    for task in tasks:
        if task.status not in ["Completed", "Cancelled"] and task.due_date < today:
            if task.status != "Overdue":
                task.status = "Overdue"
                modified = True
    if modified:
        try:
            db.commit()
        except Exception:
            db.rollback()


def create_task(db: Session, task_in: TaskCreate, current_user_id: str) -> Task:
    # Verify category exists
    category = db.query(Category).filter(Category.id == task_in.category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with id {task_in.category_id} not found",
        )

    # Verify assignee if provided
    if task_in.assigned_user_id:
        assignee = db.query(User).filter(User.id == task_in.assigned_user_id).first()
        if not assignee:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with id {task_in.assigned_user_id} not found",
            )

    initial_status = "Pending"
    if task_in.due_date < date.today():
        initial_status = "Overdue"

    db_task = Task(
        title=task_in.title,
        description=task_in.description,
        category_id=task_in.category_id,
        priority=task_in.priority,
        estimated_cost=task_in.estimated_cost,
        frequency=task_in.frequency,
        due_date=task_in.due_date,
        status=initial_status,
        created_by=current_user_id,
        assigned_user_id=task_in.assigned_user_id,
    )
    db.add(db_task)
    db.flush()

    if task_in.assigned_user_id:
        assignment = TaskAssignment(
            task_id=db_task.id,
            assigned_to=task_in.assigned_user_id,
            assigned_by=current_user_id,
            status="Active",
        )
        db.add(assignment)

    db.commit()
    db.refresh(db_task)
    return db_task


def get_tasks(
    db: Session,
    category_id: Optional[str] = None,
    status_filter: Optional[str] = None,
    assigned_user_id: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
) -> List[Task]:
    query = db.query(Task)
    if category_id:
        query = query.filter(Task.category_id == category_id)
    if status_filter:
        query = query.filter(Task.status == status_filter)
    if assigned_user_id:
        query = query.filter(Task.assigned_user_id == assigned_user_id)

    tasks = query.offset(skip).limit(limit).all()
    update_overdue_statuses(db, tasks)
    return tasks


def get_task_by_id(db: Session, task_id: str) -> Task:
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with id {task_id} not found",
        )
    update_overdue_statuses(db, [task])
    return task


def update_task(
    db: Session, task_id: str, task_update: TaskUpdate, current_user_id: str
) -> Task:
    task = get_task_by_id(db, task_id)

    update_data = task_update.dict(exclude_unset=True)

    if "category_id" in update_data and update_data["category_id"]:
        category = (
            db.query(Category).filter(Category.id == update_data["category_id"]).first()
        )
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Category with id {update_data['category_id']} not found",
            )

    if "assigned_user_id" in update_data:
        new_assignee = update_data["assigned_user_id"]
        if new_assignee and new_assignee != task.assigned_user_id:
            assignee = db.query(User).filter(User.id == new_assignee).first()
            if not assignee:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"User with id {new_assignee} not found",
                )
            # Log assignment change
            assignment = TaskAssignment(
                task_id=task.id,
                assigned_to=new_assignee,
                assigned_by=current_user_id,
                status="Active",
            )
            db.add(assignment)

    for field, value in update_data.items():
        setattr(task, field, value)

    # Re-evaluate overdue status
    if task.status not in ["Completed", "Cancelled"] and task.due_date < date.today():
        task.status = "Overdue"

    task.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(task)
    return task


def delete_task(db: Session, task_id: str) -> None:
    task = get_task_by_id(db, task_id)
    db.delete(task)
    db.commit()


def assign_task(
    db: Session, task_id: str, assign_in: TaskAssignRequest, current_user_id: str
) -> Task:
    task = get_task_by_id(db, task_id)

    if assign_in.assigned_user_id:
        user = db.query(User).filter(User.id == assign_in.assigned_user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with id {assign_in.assigned_user_id} not found",
            )

    task.assigned_user_id = assign_in.assigned_user_id
    assignment = TaskAssignment(
        task_id=task.id,
        assigned_to=assign_in.assigned_user_id,
        assigned_by=current_user_id,
        status="Active" if assign_in.assigned_user_id else "Unassigned",
    )
    db.add(assignment)
    task.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(task)
    return task
