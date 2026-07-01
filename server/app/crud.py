from sqlalchemy.orm import Session
from server.app import models, schemas
from fastapi import HTTPException


def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()


def get_user_by_id(db: Session, user_id: str):
    return db.query(models.User).filter(models.User.id == user_id).first()


def create_user(db: Session, user: schemas.UserCreate):
    if not user.username or not user.username.strip():
        raise HTTPException(status_code=400, detail="Username is invalid")

    db_user = get_user_by_username(db, user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    new_user = models.User(username=user.username)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


def get_activities_by_module(db: Session, module: str):
    valid_modules = ["nutrition", "exercise", "hygiene"]
    if module.lower() not in valid_modules:
        raise HTTPException(status_code=400, detail="Invalid module name")
    return (
        db.query(models.Activity).filter(models.Activity.module == module.lower()).all()
    )


def get_activity_by_id(db: Session, activity_id: str):
    return db.query(models.Activity).filter(models.Activity.id == activity_id).first()


def save_progress(db: Session, progress: schemas.ProgressCreate):
    user = get_user_by_id(db, progress.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    activity = get_activity_by_id(db, progress.activity_id)
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")

    existing_progress = (
        db.query(models.UserProgress)
        .filter(
            models.UserProgress.user_id == progress.user_id,
            models.UserProgress.activity_id == progress.activity_id,
        )
        .first()
    )
    if existing_progress:
        raise HTTPException(status_code=400, detail="Activity already completed")

    new_progress = models.UserProgress(
        user_id=progress.user_id, activity_id=progress.activity_id
    )
    db.add(new_progress)
    db.commit()
    db.refresh(new_progress)

    module = activity.module
    all_activities = (
        db.query(models.Activity).filter(models.Activity.module == module).all()
    )
    completed_activities = (
        db.query(models.UserProgress)
        .join(models.Activity)
        .filter(
            models.UserProgress.user_id == progress.user_id,
            models.Activity.module == module,
        )
        .all()
    )

    badge_awarded = None
    if len(completed_activities) == len(all_activities):
        badge_map = {
            "nutrition": "Veggie Champion",
            "exercise": "Active Kangaroo",
            "hygiene": "Super Soaper",
        }
        badge_name = badge_map.get(module.lower(), f"{module.capitalize()} Champion")

        existing_badge = (
            db.query(models.UserBadge)
            .filter(
                models.UserBadge.user_id == progress.user_id,
                models.UserBadge.badge_name == badge_name,
            )
            .first()
        )
        if not existing_badge:
            new_badge = models.UserBadge(
                user_id=progress.user_id, badge_name=badge_name
            )
            db.add(new_badge)
            db.commit()
            badge_awarded = badge_name

    return {
        "id": new_progress.id,
        "user_id": new_progress.user_id,
        "activity_id": new_progress.activity_id,
        "completed_at": new_progress.completed_at,
        "points_earned": activity.points if progress.completed else 0,
        "badge_awarded": badge_awarded,
    }


def get_user_progress_summary(db: Session, user_id: str):
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    completed_records = (
        db.query(models.UserProgress)
        .filter(models.UserProgress.user_id == user_id)
        .all()
    )

    completed_activities = []
    total_points = 0
    for record in completed_records:
        activity = get_activity_by_id(db, record.activity_id)
        if activity:
            completed_activities.append(
                {
                    "activity_id": activity.id,
                    "completed_at": record.completed_at,
                    "module": activity.module,
                    "name": activity.name,
                }
            )
            total_points += activity.points

    badges = (
        db.query(models.UserBadge).filter(models.UserBadge.user_id == user_id).all()
    )

    unlocked_badges = [
        {"badge_name": b.badge_name, "awarded_at": b.awarded_at} for b in badges
    ]

    return {
        "user_id": user.id,
        "username": user.username,
        "total_points": total_points,
        "completed_activities": completed_activities,
        "unlocked_badges": unlocked_badges,
    }


def seed_activities(db: Session):
    if db.query(models.Activity).count() > 0:
        return

    default_activities = [
        models.Activity(
            module="nutrition",
            name="Sort the Foods",
            points=100,
            description="Help Chef Bunny sort healthy treats into the right baskets.",
        ),
        models.Activity(
            module="exercise",
            name="Move & Groove",
            points=100,
            description="Follow fun animal stretches and get your body moving.",
        ),
        models.Activity(
            module="hygiene",
            name="Super Soaper",
            points=100,
            description="Learn the magic of clean hands and defeat the dirt bugs.",
        ),
    ]
    db.add_all(default_activities)
    db.commit()
