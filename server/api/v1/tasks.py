from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from server.database import get_db
from server.schemas.task import (
    TaskCreate,
    TaskUpdate,
    TaskAssign,
    TaskComplete,
    TaskResponse,
    TaskListResponse,
)
from server.services import task_service

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(task_in: TaskCreate, db: Session = Depends(get_db)):
    return task_service.create_task(db, task_in)


@router.get("", response_model=TaskListResponse)
def get_tasks(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    assigned_to_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    items, total = task_service.get_tasks(
        db,
        skip=skip,
        limit=limit,
        status_filter=status,
        priority_filter=priority,
        assigned_to_id=assigned_to_id,
    )
    return TaskListResponse(items=items, total=total, skip=skip, limit=limit)


@router.get("/{id}", response_model=TaskResponse)
def get_task(id: str, db: Session = Depends(get_db)):
    task = task_service.get_task_by_id(db, id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Task not found"
        )
    return task


@router.put("/{id}", response_model=TaskResponse)
def update_task(id: str, task_in: TaskUpdate, db: Session = Depends(get_db)):
    task = task_service.get_task_by_id(db, id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Task not found"
        )
    return task_service.update_task(db, task, task_in)


@router.put("/{id}/assign", response_model=TaskResponse)
def assign_task(id: str, assign_in: TaskAssign, db: Session = Depends(get_db)):
    task = task_service.get_task_by_id(db, id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Task not found"
        )
    return task_service.assign_task(db, task, assign_in.assigned_to_id)


@router.put("/{id}/complete", response_model=TaskResponse)
def complete_task(id: str, complete_in: TaskComplete, db: Session = Depends(get_db)):
    task = task_service.get_task_by_id(db, id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Task not found"
        )
    return task_service.complete_task(
        db, task, complete_in.actual_cost, complete_in.resolution_notes
    )


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(id: str, db: Session = Depends(get_db)):
    task = task_service.get_task_by_id(db, id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Task not found"
        )
    task_service.delete_task(db, task)
    return None
