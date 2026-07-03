"""
Module: tasks router
Purpose: Endpoints for task CRUD operations and assignment
"""

from typing import List, Optional
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.app.database import get_db
from server.app.models import Task, User
from server.app.schemas import TaskCreate, TaskUpdate, TaskResponse
from server.app.auth import get_current_user

router = APIRouter()


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(
    task_in: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Verify assignee exists if provided
    if task_in.assignee_id:
        assignee = db.query(User).filter(User.id == task_in.assignee_id).first()
        if not assignee:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Assignee user not found",
            )

    new_task = Task(
        title=task_in.title,
        description=task_in.description,
        priority=task_in.priority,
        due_date=task_in.due_date,
        assignee_id=task_in.assignee_id,
        reporter_id=current_user.id,
        status="To Do",
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task


@router.get("", response_model=List[TaskResponse])
def list_tasks(
    assignee_id: Optional[str] = None,
    priority: Optional[str] = None,
    status_filter: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Note: status_filter is used instead of status to avoid shadowing the fastapi status module
    query = db.query(Task)
    if assignee_id:
        query = query.filter(Task.assignee_id == assignee_id)
    if priority:
        query = query.filter(Task.priority == priority)
    if status_filter:
        query = query.filter(Task.status == status_filter)

    # Order by created_at to ensure deterministic ordering
    tasks = query.order_by(Task.created_at.desc()).offset(skip).limit(limit).all()
    return tasks


@router.get("/{task_id}", response_model=TaskResponse)
def get_task(
    task_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Task not found"
        )
    return task


@router.put("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: str,
    task_in: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Task not found"
        )

    if task_in.assignee_id is not None:
        if task_in.assignee_id == "":
            task.assignee_id = None  # type: ignore
        else:
            assignee = db.query(User).filter(User.id == task_in.assignee_id).first()
            if not assignee:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Assignee user not found",
                )
            task.assignee_id = task_in.assignee_id  # type: ignore

    if task_in.title is not None:
        task.title = task_in.title  # type: ignore
    if task_in.description is not None:
        task.description = task_in.description  # type: ignore
    if task_in.priority is not None:
        task.priority = task_in.priority  # type: ignore
    if task_in.due_date is not None:
        task.due_date = task_in.due_date  # type: ignore
    if task_in.status is not None:
        task.status = task_in.status  # type: ignore

    db.commit()
    db.refresh(task)
    return task


@router.delete("/{task_id}")
def delete_task(
    task_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Task not found"
        )
    db.delete(task)
    db.commit()
    return {"detail": "Task deleted"}


# Helper endpoint to trigger/test reminders
@router.post("/reminders/trigger")
def trigger_reminders(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    """
    Find tasks due in the next 24 hours and 'send' reminders (mocked by returning them).
    """
    now = datetime.now(timezone.utc)
    reminder_window_start = now
    reminder_window_end = now + timedelta(hours=24)

    # Query tasks due in the next 24 hours that are not Done
    upcoming_tasks = (
        db.query(Task)
        .filter(
            Task.due_date >= reminder_window_start,
            Task.due_date <= reminder_window_end,
            Task.status != "Done",
        )
        .all()
    )

    reminders_sent = []
    for task in upcoming_tasks:
        reminders_sent.append(
            {
                "task_id": task.id,
                "title": task.title,
                "due_date": task.due_date.isoformat(),
                "assignee_id": task.assignee_id,
                "message": f"Reminder: Task '{task.title}' is due in less than 24 hours!",
            }
        )

    return {"reminders_sent": reminders_sent, "count": len(reminders_sent)}
