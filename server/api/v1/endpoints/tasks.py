"""Tasks API endpoints."""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from server.api.v1.endpoints.auth import get_current_user
from server.crud import (
    bulk_update_tasks,
    create_task,
    delete_task,
    get_project,
    get_task,
    get_user_by_id,
    list_tasks,
    update_task,
)
from server.database import get_db
from server.models import User
from server.schemas import (
    BulkTaskUpdate,
    BulkTaskUpdateResponse,
    TaskCreate,
    TaskResponse,
    TaskUpdate,
)

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get(
    "",
    response_model=List[TaskResponse],
    status_code=status.HTTP_200_OK,
    summary="List tasks",
)
def get_all_tasks(
    project_id: Optional[str] = Query(None),
    assignee_id: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    priority: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List tasks with optional filters for project, assignee, status, priority."""
    tasks = list_tasks(
        db,
        project_id=project_id,
        assignee_id=assignee_id,
        status=status_filter,
        priority=priority,
        skip=skip,
        limit=limit,
    )
    return tasks


@router.patch(
    "/bulk-update",
    response_model=BulkTaskUpdateResponse,
    status_code=status.HTTP_200_OK,
    summary="Atomically bulk update task statuses",
)
def bulk_update_task_status(
    bulk_in: BulkTaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Atomically update status for a list of task IDs in a single transaction."""
    valid_statuses = ["To Do", "In Progress", "Done", "Completed", "On Hold", "Review"]
    if bulk_in.status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid status '{bulk_in.status}'. Allowed: {valid_statuses}",
        )
    try:
        updated_tasks = bulk_update_tasks(
            db, task_ids=bulk_in.task_ids, target_status=bulk_in.status
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Bulk update failed: {str(e)}",
        )

    return {
        "updated_count": len(updated_tasks),
        "tasks": updated_tasks,
    }


@router.post(
    "",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new task",
)
def create_new_task(
    task_in: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new task under a project."""
    # Verify project exists
    project = get_project(db, project_id=task_in.project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Project with ID '{task_in.project_id}' does not exist",
        )

    # Verify assignee if provided
    if task_in.assignee_id:
        assignee = get_user_by_id(db, user_id=task_in.assignee_id)
        if not assignee:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Assignee with ID '{task_in.assignee_id}' does not exist",
            )

    task = create_task(db, task_in=task_in)
    return task


@router.get(
    "/{task_id}",
    response_model=TaskResponse,
    status_code=status.HTTP_200_OK,
    summary="Get task details by ID",
)
def get_task_by_id(
    task_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve specific task details."""
    task = get_task(db, task_id=task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID '{task_id}' not found",
        )
    return task


@router.patch(
    "/{task_id}",
    response_model=TaskResponse,
    status_code=status.HTTP_200_OK,
    summary="Update task details",
)
@router.put(
    "/{task_id}",
    response_model=TaskResponse,
    status_code=status.HTTP_200_OK,
    summary="Update task details",
)
def update_task_by_id(
    task_id: str,
    task_in: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update task summary, status, priority, due date, or assignee."""
    task = get_task(db, task_id=task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID '{task_id}' not found",
        )

    if task_in.assignee_id:
        assignee = get_user_by_id(db, user_id=task_in.assignee_id)
        if not assignee:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Assignee with ID '{task_in.assignee_id}' does not exist",
            )

    updated = update_task(db, task=task, task_in=task_in)
    return updated


@router.delete(
    "/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a task",
)
def delete_task_by_id(
    task_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a task."""
    task = get_task(db, task_id=task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID '{task_id}' not found",
        )
    delete_task(db, task=task)
    return None
