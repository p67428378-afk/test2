import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Optional

from server.database import get_db, init_db, seed_data
from server.schemas import (
    UserSignUp,
    UserLogin,
    UserResponse,
    TokenResponse,
    TaskCreate,
    TaskUpdate,
    TaskResponse,
    TaskListResponse,
    DashboardStatsResponse,
)
from server import crud
from server.auth import create_access_token, get_current_user
from server.models import User


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database and seed data on startup
    init_db()
    db = next(get_db())
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="TaskFlow API",
    description="API for Task Management Application with User Authentication, Task CRUD, and Interactive Dashboard",
    version="1.0.0",
    lifespan=lifespan,
)

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


# Auth Routes
@app.post(
    "/api/v1/auth/signup",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def signup(user_in: UserSignUp, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user_in.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )
    return crud.create_user(db=db, user_in=user_in)


@app.post("/api/v1/auth/login", response_model=TokenResponse)
def login(user_in: UserLogin, db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, email=user_in.email, password=user_in.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    access_token = create_access_token(data={"sub": user.id})
    return {"access_token": access_token, "token_type": "bearer", "expires_in": 3600}


# Task Routes
@app.post(
    "/api/v1/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED
)
def create_task(
    task_in: TaskCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Validate status and priority
    valid_statuses = ["Pending", "In Progress", "Completed"]
    valid_priorities = ["Low", "Medium", "High", "Urgent"]
    if task_in.status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid status. Must be one of {valid_statuses}",
        )
    if task_in.priority not in valid_priorities:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid priority. Must be one of {valid_priorities}",
        )
    return crud.create_task(db=db, task_in=task_in, user_id=current_user.id)


@app.get("/api/v1/tasks", response_model=TaskListResponse)
def list_tasks(
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    tag: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    sort_by: Optional[str] = Query(None),
    order: str = Query("asc"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Validate query parameters
    valid_statuses = ["Pending", "In Progress", "Completed"]
    valid_priorities = ["Low", "Medium", "High", "Urgent"]
    valid_sort_fields = ["due_date", "priority", "created_at"]

    if status and status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid status filter. Must be one of {valid_statuses}",
        )
    if priority and priority not in valid_priorities:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid priority filter. Must be one of {valid_priorities}",
        )
    if sort_by and sort_by not in valid_sort_fields:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid sort field. Must be one of {valid_sort_fields}",
        )
    if order not in ["asc", "desc"]:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid order. Must be 'asc' or 'desc'",
        )

    items, total = crud.get_tasks(
        db=db,
        user_id=current_user.id,
        status=status,
        priority=priority,
        tag=tag,
        search=search,
        sort_by=sort_by,
        order=order,
        skip=skip,
        limit=limit,
    )
    return {"items": items, "total": total, "skip": skip, "limit": limit}


@app.get("/api/v1/tasks/{id}", response_model=TaskResponse)
def get_task(
    id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    task = crud.get_task(db=db, task_id=id, user_id=current_user.id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Task not found"
        )
    return task


@app.put("/api/v1/tasks/{id}", response_model=TaskResponse)
def update_task(
    id: str,
    task_in: TaskUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    task = crud.get_task(db=db, task_id=id, user_id=current_user.id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Task not found"
        )

    # Validate status and priority if provided
    valid_statuses = ["Pending", "In Progress", "Completed"]
    valid_priorities = ["Low", "Medium", "High", "Urgent"]
    if task_in.status and task_in.status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid status. Must be one of {valid_statuses}",
        )
    if task_in.priority and task_in.priority not in valid_priorities:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid priority. Must be one of {valid_priorities}",
        )

    return crud.update_task(db=db, db_task=task, task_in=task_in)


@app.delete("/api/v1/tasks/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    task = crud.get_task(db=db, task_id=id, user_id=current_user.id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Task not found"
        )
    crud.delete_task(db=db, db_task=task)
    return


# Dashboard Stats Route
@app.get("/api/v1/dashboard/stats", response_model=DashboardStatsResponse)
def get_dashboard_stats(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    return crud.get_dashboard_stats(db=db, user_id=current_user.id)
