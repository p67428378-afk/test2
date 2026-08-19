from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models.user import User
from server.schemas.task import TaskRead, TaskCreate, TaskUpdate, TaskAssignRequest
from server.schemas.completion import (
    CompletionLogCreate,
    CompletionLogRead,
    TaskCompletionResponse,
)
from server.security import get_current_user
from server.services import task_service, completion_service

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.post("", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
def create_task(
    task_in: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return task_service.create_task(db, task_in, current_user.id)


@router.get("", response_model=List[TaskRead])
def list_tasks(
    category_id: Optional[str] = Query(None, description="Filter by category ID"),
    status: Optional[str] = Query(
        None,
        description="Filter by status (Pending, In Progress, Overdue, Completed, Cancelled)",
    ),
    assigned_user_id: Optional[str] = Query(
        None, description="Filter by assigned user ID"
    ),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return task_service.get_tasks(
        db,
        category_id=category_id,
        status_filter=status,
        assigned_user_id=assigned_user_id,
        skip=skip,
        limit=limit,
    )


@router.get("/{task_id}", response_model=TaskRead)
def get_task(
    task_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return task_service.get_task_by_id(db, task_id)


@router.put("/{task_id}", response_model=TaskRead)
def update_task(
    task_id: str,
    task_in: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return task_service.update_task(db, task_id, task_in, current_user.id)


@router.delete("/{task_id}", status_code=status.HTTP_200_OK)
def delete_task(
    task_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task_service.delete_task(db, task_id)
    return {"detail": "Task deleted successfully"}


@router.post("/{task_id}/assign", response_model=TaskRead)
def assign_task(
    task_id: str,
    assign_in: TaskAssignRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return task_service.assign_task(db, task_id, assign_in, current_user.id)


@router.post("/{task_id}/complete", response_model=TaskCompletionResponse)
def complete_task(
    task_id: str,
    completion_in: CompletionLogCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return completion_service.complete_task(db, task_id, completion_in, current_user.id)


@router.get("/{task_id}/logs", response_model=List[CompletionLogRead])
def get_task_logs(
    task_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return completion_service.get_task_completion_logs(db, task_id)
