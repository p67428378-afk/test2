from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid
from server import schemas, crud
from server.database import get_db

router = APIRouter()


@router.get("/todos", response_model=List[schemas.TodoResponse])
def read_todos(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    todos = crud.get_todos(db, skip=skip, limit=limit)
    return todos


@router.post(
    "/todos", response_model=schemas.TodoResponse, status_code=status.HTTP_201_CREATED
)
def create_todo(todo: schemas.TodoCreate, db: Session = Depends(get_db)):
    return crud.create_todo(db=db, todo=todo)


@router.get("/todos/{id}", response_model=schemas.TodoResponse)
def read_todo(id: uuid.UUID, db: Session = Depends(get_db)):
    db_todo = crud.get_todo(db, todo_id=id)
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo item not found")
    return db_todo


@router.put("/todos/{id}", response_model=schemas.TodoResponse)
def update_todo(
    id: uuid.UUID, todo_update: schemas.TodoUpdate, db: Session = Depends(get_db)
):
    db_todo = crud.get_todo(db, todo_id=id)
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo item not found")
    return crud.update_todo(db=db, db_todo=db_todo, todo_update=todo_update)


@router.delete("/todos/{id}", response_model=schemas.TodoDeleteResponse)
def delete_todo(id: uuid.UUID, db: Session = Depends(get_db)):
    db_todo = crud.get_todo(db, todo_id=id)
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo item not found")
    crud.delete_todo(db=db, db_todo=db_todo)
    return schemas.TodoDeleteResponse(message="Todo item deleted successfully")
