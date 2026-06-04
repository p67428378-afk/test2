from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from server import schemas, models
from server.database import get_db

router = APIRouter()

@router.post("/todos", response_model=schemas.Todo)
def create_todo(todo: schemas.TodoCreate, db: Session = Depends(get_db)):
    if not todo.title:
        raise HTTPException(status_code=422, detail="title missing/empty")
    db_todo = models.Todo(title=todo.title)
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

@router.get("/todos", response_model=List[schemas.Todo])
def read_todos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    todos = db.query(models.Todo).order_by(models.Todo.created_at.desc()).offset(skip).limit(limit).all()
    return todos
