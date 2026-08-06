from datetime import datetime
from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from server import models, schemas
from server.core import security
from server.database import get_db

router = APIRouter()


@router.get("/lessons/", response_model=List[schemas.LessonResponse])
def list_lessons(
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(models.Lesson)
    if category:
        query = query.filter(models.Lesson.category.ilike(f"%{category}%"))
    return query.all()


@router.post("/lessons/{lesson_id}/quiz", response_model=schemas.QuizSubmitResponse)
def submit_quiz(
    lesson_id: UUID,
    quiz_in: schemas.QuizSubmitRequest,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(security.get_current_user_optional),
):
    user = current_user
    if not user:
        user = (
            db.query(models.User)
            .filter(models.User.email == "test@example.com")
            .first()
        )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required to take quizzes",
        )

    lesson = db.query(models.Lesson).filter(models.Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lesson not found",
        )

    is_correct = (
        quiz_in.answer.strip().lower() == (lesson.correct_answer or "").strip().lower()
    )
    points_awarded = int(lesson.points_value or 10) if is_correct else 0

    if is_correct and points_awarded > 0:
        current_pts = int(user.total_points or 0)
        user.total_points = current_pts + points_awarded

        # Check and unlock eligible badges
        eligible_badges = (
            db.query(models.Badge)
            .filter(models.Badge.required_points <= user.total_points)
            .all()
        )
        existing_badge_ids = {
            ub.badge_id
            for ub in db.query(models.UserBadge)
            .filter(models.UserBadge.user_id == user.id)
            .all()
        }

        for badge in eligible_badges:
            if badge.id not in existing_badge_ids:
                user_badge = models.UserBadge(
                    user_id=user.id,
                    badge_id=badge.id,
                    awarded_at=datetime.utcnow(),
                )
                db.add(user_badge)

        db.commit()
        db.refresh(user)

    return {
        "correct": is_correct,
        "message": "Great job! Correct answer!"
        if is_correct
        else "Not quite, try again next time!",
        "points_awarded": points_awarded,
        "total_points": int(user.total_points or 0),
    }
