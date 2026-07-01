from fastapi import FastAPI, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from contextlib import asynccontextmanager

from server.app.database import engine, Base, get_db
from server.app import crud, schemas, models


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    db = next(get_db())
    try:
        crud.seed_activities(db)
        test_user = crud.get_user_by_username(db, "test_user")
        if not test_user:
            db_user = models.User(username="test_user")
            db.add(db_user)
            db.commit()
    finally:
        db.close()
    yield


app = FastAPI(
    title="HealthQuest API",
    description="Interactive Health Habits Learning Platform for Kids",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post(
    "/api/v1/users",
    response_model=schemas.UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db, user)


@app.get("/api/v1/activities/{module}", response_model=List[schemas.ActivityResponse])
def get_activities(module: str, db: Session = Depends(get_db)):
    return crud.get_activities_by_module(db, module)


@app.post("/api/v1/progress", response_model=schemas.ProgressResponse)
def save_progress(progress: schemas.ProgressCreate, db: Session = Depends(get_db)):
    return crud.save_progress(db, progress)


@app.get(
    "/api/v1/progress/{user_id}", response_model=schemas.UserProgressSummaryResponse
)
def get_progress_summary(user_id: str, db: Session = Depends(get_db)):
    return crud.get_user_progress_summary(db, user_id)
