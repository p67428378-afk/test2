from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models.todo import Todo
from server.schemas.todo import TodoCreate, TodoUpdate, TodoResponse

router = APIRouter(prefix="/todos", tags=["todos"])


@router.get(
    "",
    response_model=List[TodoResponse],
    status_code=status.HTTP_200_OK,
    summary="List all TODO items",
)
def list_todos(
    skip: int = Query(
        default=0, ge=0, description="Number of items to skip for pagination"
    ),
    limit: int = Query(
        default=100, ge=1, le=1000, description="Maximum number of items to return"
    ),
    completed: Optional[bool] = Query(
        default=None, description="Filter items by completion status"
    ),
    db: Session = Depends(get_db),
):
    query = db.query(Todo)
    if completed is not None:
        query = query.filter(Todo.completed == completed)
    todos = query.order_by(Todo.created_at.desc()).offset(skip).limit(limit).all()
    return todos


@router.post(
    "",
    response_model=TodoResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new TODO item",
)
def create_todo(
    todo_in: TodoCreate,
    db: Session = Depends(get_db),
):
    new_todo = Todo(
        title=todo_in.title.strip(),
        description=todo_in.description.strip() if todo_in.description else None,
        completed=False,
    )
    db.add(new_todo)
    db.commit()
    db.refresh(new_todo)
    return new_todo


@router.get(
    "/{todo_id}",
    response_model=TodoResponse,
    status_code=status.HTTP_200_OK,
    summary="Get a single TODO item by ID",
)
def get_todo(
    todo_id: str,
    db: Session = Depends(get_db),
):
    todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="TODO item not found",
        )
    return todo


@router.put(
    "/{todo_id}",
    response_model=TodoResponse,
    status_code=status.HTTP_200_OK,
    summary="Update an existing TODO item",
)
def update_todo(
    todo_id: str,
    todo_in: TodoUpdate,
    db: Session = Depends(get_db),
):
    todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="TODO item not found",
        )

    if todo_in.title is not None:
        todo.title = todo_in.title.strip()
    if todo_in.description is not None:
        todo.description = todo_in.description.strip() if todo_in.description else None
    if todo_in.completed is not None:
        todo.completed = todo_in.completed

    todo.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(todo)
    return todo


@router.delete(
    "/{todo_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a TODO item",
)
def delete_todo(
    todo_id: str,
    db: Session = Depends(get_db),
):
    todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="TODO item not found",
        )
    db.delete(todo)
    db.commit()
    return None
