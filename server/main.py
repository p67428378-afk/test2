from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
import os

from server.database import Base, engine, get_db
from server.schemas import TaskCreate, TaskUpdate, TaskResponse, TaskReorder
from server import crud

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="TaskFlow API", version="1.0.0")

# CORS Middleware
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000"
).split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post(
    "/api/v1/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED
)
def create_task(task_in: TaskCreate, db: Session = Depends(get_db)):
    if not task_in.text.strip():
        raise HTTPException(status_code=422, detail="Task text cannot be empty")
    return crud.create_task(db=db, task_in=task_in)


@app.get("/api/v1/tasks", response_model=List[TaskResponse])
def read_tasks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_tasks(db=db, skip=skip, limit=limit)


@app.put("/api/v1/tasks/reorder")
def reorder_tasks(reorder_in: TaskReorder, db: Session = Depends(get_db)):
    # Verify all task IDs exist
    for task_id in reorder_in.task_ids:
        task_exists = db.query(crud.Task).filter(crud.Task.id == task_id).first()
        if not task_exists:
            raise HTTPException(
                status_code=422, detail=f"Task with ID {task_id} not found"
            )
    crud.reorder_tasks(db=db, task_ids=reorder_in.task_ids)
    return {"success": True}


@app.put("/api/v1/tasks/{task_id}", response_model=TaskResponse)
def update_task(task_id: UUID, task_in: TaskUpdate, db: Session = Depends(get_db)):
    if task_in.text is not None and not task_in.text.strip():
        raise HTTPException(status_code=422, detail="Task text cannot be empty")
    db_task = crud.update_task(db=db, task_id=task_id, task_in=task_in)
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task


@app.delete("/api/v1/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: UUID, db: Session = Depends(get_db)):
    success = crud.delete_task(db=db, task_id=task_id)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")
    return None
