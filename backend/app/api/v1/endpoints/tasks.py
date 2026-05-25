from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.schemas import task as task_schema
from app.services import task_service
from app.db.database import get_db

router = APIRouter()

@router.post("/tasks/", response_model=task_schema.Task)
def create_task(task: task_schema.TaskCreate, db: Session = Depends(get_db)):
    return task_service.create_task(db=db, task=task)

@router.get("/tasks/", response_model=List[task_schema.Task])
def read_tasks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    tasks = task_service.get_tasks(db, skip=skip, limit=limit)
    return tasks

@router.get("/tasks/{task_id}", response_model=task_schema.Task)
def read_task(task_id: int, db: Session = Depends(get_db)):
    db_task = task_service.get_task(db, task_id=task_id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task

@router.put("/tasks/{task_id}", response_model=task_schema.Task)
def update_task(task_id: int, task: task_schema.TaskUpdate, db: Session = Depends(get_db)):
    db_task = task_service.update_task(db, task_id=task_id, task=task)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task

@router.put("/tasks/{task_id}/complete", response_model=task_schema.Task)
def complete_task(task_id: int, db: Session = Depends(get_db)):
    db_task = task_service.complete_task(db, task_id=task_id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task

@router.delete("/tasks/{task_id}", response_model=task_schema.Task)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    db_task = task_service.delete_task(db, task_id=task_id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task
