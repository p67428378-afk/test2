from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from contextlib import asynccontextmanager

from server.app.database import engine, Base, get_db
from server.app import models, schemas, crud


# Seed default activities and a test user
def seed_data(db: Session):
    # Seed activities
    default_activities = [
        {
            "module": "nutrition",
            "name": "Sort the Foods!",
            "description": "Help Chef Bunny sort healthy treats into the right baskets.",
            "points": 100,
        },
        {
            "module": "exercise",
            "name": "Move & Groove!",
            "description": "Follow fun animal stretches and get your body moving.",
            "points": 100,
        },
        {
            "module": "hygiene",
            "name": "Super Soaper!",
            "description": "Learn the magic of clean hands and defeat the dirt bugs.",
            "points": 100,
        },
    ]

    for act_data in default_activities:
        existing = (
            db.query(models.Activity)
            .filter(
                models.Activity.module == act_data["module"],
                models.Activity.name == act_data["name"],
            )
            .first()
        )
        if not existing:
            db_act = models.Activity(**act_data)
            db.add(db_act)

    # Seed test user
    test_username = "test@example.com"
    existing_user = (
        db.query(models.User).filter(models.User.username == test_username).first()
    )
    if not existing_user:
        db_user = models.User(username=test_username)
        db.add(db_user)

    db.commit()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables
    Base.metadata.create_all(bind=engine)
    # Seed data
    db = next(get_db())
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="HealthQuest API",
    description="API for health habits learning for kids",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Endpoints


@app.post(
    "/api/v1/users",
    response_model=schemas.UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_or_get_user(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    username = user_in.username.strip()
    if not username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Username cannot be empty"
        )

    # Check if user already exists
    db_user = crud.get_user_by_username(db, username)
    if db_user:
        # Return existing user with 200 OK instead of 201 Created
        # Wait, FastAPI response_model will serialize it. But we can return it directly.
        # Let's check if we should return 201 or 200. Returning the user is fine.
        return db_user

    # Create new user
    try:
        return crud.create_user(db, username)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Could not create user: {str(e)}",
        )


@app.get("/api/v1/activities/{module}", response_model=List[schemas.ActivityResponse])
def get_activities(module: str, db: Session = Depends(get_db)):
    valid_modules = ["nutrition", "exercise", "hygiene"]
    if module.lower() not in valid_modules:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid module name. Must be one of {valid_modules}",
        )

    activities = crud.get_activities_by_module(db, module.lower())
    return activities


@app.post("/api/v1/progress", response_model=schemas.ProgressResponse)
def save_progress(progress_in: schemas.ProgressCreate, db: Session = Depends(get_db)):
    # Check user
    user = crud.get_user(db, progress_in.user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    # Check activity
    activity = crud.get_activity(db, progress_in.activity_id)
    if not activity:
        raise HTTPException(
            status_code=status.HTTP_444_NOT_FOUND
            if False
            else status.HTTP_404_NOT_FOUND,
            detail="Activity not found",
        )

    # Check if already completed
    existing_progress = crud.get_user_progress(
        db, progress_in.user_id, progress_in.activity_id
    )
    if existing_progress:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Activity already completed"
        )

    # Save progress if completed is True
    if not progress_in.completed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Completed must be true to save progress",
        )

    # Create progress
    db_progress = crud.create_user_progress(
        db, progress_in.user_id, progress_in.activity_id
    )

    # Check and award badge
    # Get all activities in this module
    all_module_activities = crud.get_activities_by_module(db, activity.module)
    # Get completed activities in this module
    completed_module_progress = crud.get_completed_activities_by_user_and_module(
        db, progress_in.user_id, activity.module
    )

    completed_activity_ids = {p.activity_id for p in completed_module_progress}
    all_activity_ids = {a.id for a in all_module_activities}

    badge_awarded = None
    if all_activity_ids.issubset(completed_activity_ids):
        # Award badge
        badge_map = {
            "nutrition": "Veggie Champion",
            "exercise": "Active Kangaroo",
            "hygiene": "Super Soaper",
        }
        badge_name = badge_map.get(
            activity.module.lower(), f"{activity.module.capitalize()} Champion"
        )

        # Check if badge already awarded
        existing_badges = crud.get_user_badges(db, progress_in.user_id)
        has_badge = any(b.badge_name == badge_name for b in existing_badges)
        if not has_badge:
            crud.create_user_badge(db, progress_in.user_id, badge_name)
            badge_awarded = badge_name

    # Prepare response
    response_data = schemas.ProgressResponse(
        id=db_progress.id,
        user_id=db_progress.user_id,
        activity_id=db_progress.activity_id,
        points_earned=activity.points,
        badge_awarded=badge_awarded,
        completed_at=db_progress.completed_at,
    )
    return response_data


@app.get(
    "/api/v1/progress/{user_id}", response_model=schemas.UserProgressSummaryResponse
)
def get_user_progress_summary(user_id: str, db: Session = Depends(get_db)):
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    # Get all progress entries
    progress_entries = (
        db.query(models.UserProgress)
        .filter(models.UserProgress.user_id == user_id)
        .all()
    )

    completed_activities = []
    total_points = 0
    for entry in progress_entries:
        act = entry.activity
        if act:
            completed_activities.append(
                schemas.CompletedActivityInfo(
                    activity_id=entry.activity_id,
                    completed_at=entry.completed_at,
                    module=act.module,
                    name=act.name,
                )
            )
            total_points += act.points

    # Get badges
    badges = crud.get_user_badges(db, user_id)
    unlocked_badges = [
        schemas.UnlockedBadgeInfo(badge_name=b.badge_name, awarded_at=b.awarded_at)
        for b in badges
    ]

    return schemas.UserProgressSummaryResponse(
        user_id=user.id,
        username=user.username,
        total_points=total_points,
        completed_activities=completed_activities,
        unlocked_badges=unlocked_badges,
    )
