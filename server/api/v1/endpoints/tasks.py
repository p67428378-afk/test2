from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server import crud, schemas

router = APIRouter()

@router.get("", response_model=List[schemas.TaskResponse])
def read_tasks(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    tasks = crud.get_tasks(db, skip=skip, limit=limit)
    return tasks

@router.post("", response_model=schemas.TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    if not task.description or not task.description.strip():
        raise HTTPException(status_code=400, detail="Description is empty or missing.")
    return crud.create_task(db=db, task=task)

@router.get("/{task_id}", response_model=schemas.TaskResponse)
def read_task(task_id: str, db: Session = Depends(get_db)):
    db_task = crud.get_task(db, task_id=task_id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task with the specified ID does not exist.")
    return db_task

@router.put("/{task_id}", response_model=schemas.TaskResponse)
def update_task(task_id: str, task_update: schemas.TaskUpdate, db: Session = Depends(get_db)):
    if task_update.description is not None and (not task_update.description or not task_update.description.strip()):
        raise HTTPException(status_code=400, detail="Description is empty if provided.")
    
    db_task = crud.update_task(db, task_id=task_id, task_update=task_update)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task with the specified ID does not exist.")
    return db_task

@router.delete("/{task_id}")
def delete_task(task_id: str, db: Session = Depends(get_db)):
    success = crud.delete_task(db, task_id=task_id)
    if not success:
        raise HTTPException(status_code=404, detail="Task with the specified ID does not exist.")
    return {"detail": "Task deleted successfully"}
