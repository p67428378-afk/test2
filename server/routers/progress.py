from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import User, LearningItem, ProgressLog
from server.schemas import (
    ProgressLogRequest,
    ProgressLogResponse,
    ProgressSummaryResponse,
)
from server.routers.auth import get_current_user
from jose import jwt, JWTError
from server.config import settings

router = APIRouter(prefix="/api/v1/progress", tags=["progress"])


def get_current_user_or_default(
    authorization: str = Header(None), db: Session = Depends(get_db)
) -> User:
    # If authorization header is present, try to decode it
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        try:
            payload = jwt.decode(
                token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
            )
            username: str = payload.get("sub")
            if username:
                user = db.query(User).filter(User.username == username).first()
                if user:
                    return user
        except JWTError:
            pass

    # Fallback to default user (first user in DB, e.g., parent_admin or test@example.com)
    default_user = db.query(User).first()
    if not default_user:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="No users seeded in the database",
        )
    return default_user


@router.post(
    "", response_model=ProgressLogResponse, status_code=status.HTTP_201_CREATED
)
def log_progress(
    request: ProgressLogRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user_or_default),
):
    # Check if learning item exists
    item = (
        db.query(LearningItem)
        .filter(LearningItem.id == request.learning_item_id)
        .first()
    )
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Learning item not found"
        )

    # Check if progress already logged
    existing_log = (
        db.query(ProgressLog)
        .filter(ProgressLog.user_id == user.id, ProgressLog.learning_item_id == item.id)
        .first()
    )

    if existing_log:
        return existing_log

    # Create new progress log
    new_log = ProgressLog(user_id=user.id, learning_item_id=item.id)
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return new_log


@router.get("", response_model=ProgressSummaryResponse)
def get_progress_summary(
    db: Session = Depends(get_db), user: User = Depends(get_current_user_or_default)
):
    logs = db.query(ProgressLog).filter(ProgressLog.user_id == user.id).all()
    explored_item_ids = [log.learning_item_id for log in logs]
    total_stars = len(explored_item_ids)
    return {"total_stars": total_stars, "explored_item_ids": explored_item_ids}


@router.post("/reset")
def reset_progress(
    db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    db.query(ProgressLog).filter(ProgressLog.user_id == user.id).delete()
    db.commit()
    return {"status": "success", "message": "Progress reset successfully"}
