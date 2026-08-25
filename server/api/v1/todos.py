from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from server.core.database import get_db
from server.models.todo import Todo as TodoModel
from server.schemas.todo import Todo, TodoCreate, TodoUpdate

router = APIRouter(prefix="/todos", tags=["todos"])


@router.get("", response_model=List[Todo])
def get_todos(
    completed: Optional[bool] = Query(None, description="Filter by completion status"),
    search: Optional[str] = Query(
        None, description="Search keyword in title or description"
    ),
    skip: int = Query(0, ge=0, description="Number of items to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Max number of items to return"),
    db: Session = Depends(get_db),
):
    """Retrieve all todo items with optional filtering and search."""
    query = db.query(TodoModel)

    if completed is not None:
        query = query.filter(TodoModel.completed == completed)

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                TodoModel.title.ilike(search_pattern),
                TodoModel.description.ilike(search_pattern),
            )
        )

    query = query.order_by(TodoModel.created_at.desc())
    todos = query.offset(skip).limit(limit).all()
    return todos


@router.post("", response_model=Todo, status_code=status.HTTP_201_CREATED)
def create_todo(
    todo_in: TodoCreate,
    db: Session = Depends(get_db),
):
    """Create a new todo task."""
    todo_item = TodoModel(
        title=todo_in.title.strip(),
        description=todo_in.description.strip() if todo_in.description else None,
        completed=False,
    )
    db.add(todo_item)
    db.commit()
    db.refresh(todo_item)
    return todo_item


@router.get("/{id}", response_model=Todo)
def get_todo_by_id(
    id: str,
    db: Session = Depends(get_db),
):
    """Retrieve details of a single todo item by UUID."""
    todo = db.query(TodoModel).filter(TodoModel.id == id).first()
    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo item with ID '{id}' not found",
        )
    return todo


@router.put("/{id}", response_model=Todo)
def update_todo(
    id: str,
    todo_in: TodoUpdate,
    db: Session = Depends(get_db),
):
    """Update title, description, or completed status of an existing todo."""
    todo = db.query(TodoModel).filter(TodoModel.id == id).first()
    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo item with ID '{id}' not found",
        )

    update_data = todo_in.model_dump(exclude_unset=True)
    if not update_data:
        return todo

    for field, value in update_data.items():
        if field == "title" and value is not None:
            setattr(todo, field, value.strip())
        elif field == "description" and value is not None:
            setattr(todo, field, value.strip() if value else None)
        else:
            setattr(todo, field, value)

    todo.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(todo)
    return todo


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(
    id: str,
    db: Session = Depends(get_db),
):
    """Permanently delete a todo task."""
    todo = db.query(TodoModel).filter(TodoModel.id == id).first()
    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo item with ID '{id}' not found",
        )
    db.delete(todo)
    db.commit()
    return None
