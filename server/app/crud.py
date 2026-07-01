from sqlalchemy.orm import Session
from server.app import models


def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()


def create_user(db: Session, username: str):
    db_user = models.User(username=username)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_user(db: Session, user_id: str):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_activities_by_module(db: Session, module: str):
    return db.query(models.Activity).filter(models.Activity.module == module).all()


def get_activity(db: Session, activity_id: str):
    return db.query(models.Activity).filter(models.Activity.id == activity_id).first()


def get_user_progress(db: Session, user_id: str, activity_id: str):
    return (
        db.query(models.UserProgress)
        .filter(
            models.UserProgress.user_id == user_id,
            models.UserProgress.activity_id == activity_id,
        )
        .first()
    )


def create_user_progress(db: Session, user_id: str, activity_id: str):
    db_progress = models.UserProgress(user_id=user_id, activity_id=activity_id)
    db.add(db_progress)
    db.commit()
    db.refresh(db_progress)
    return db_progress


def get_user_badges(db: Session, user_id: str):
    return db.query(models.UserBadge).filter(models.UserBadge.user_id == user_id).all()


def create_user_badge(db: Session, user_id: str, badge_name: str):
    db_badge = models.UserBadge(user_id=user_id, badge_name=badge_name)
    db.add(db_badge)
    db.commit()
    db.refresh(db_badge)
    return db_badge


def get_completed_activities_by_user_and_module(db: Session, user_id: str, module: str):
    return (
        db.query(models.UserProgress)
        .join(models.Activity)
        .filter(
            models.UserProgress.user_id == user_id, models.Activity.module == module
        )
        .all()
    )
