import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import Module, AnimationCheckpoint
from server.schemas import (
    AnimationCheckpointResponse,
    AnimationCheckpointCreate,
    QuizEvaluateRequest,
    QuizEvaluateResponse,
)

router = APIRouter(prefix="/api/v1/quizzes", tags=["Animation Checkpoints & Quizzes"])


@router.get("/module/{module_id}", response_model=List[AnimationCheckpointResponse])
def get_module_quizzes(module_id: str, db: Session = Depends(get_db)):
    try:
        uuid.UUID(str(module_id))
    except (ValueError, TypeError, AttributeError):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid UUID format for module ID",
        )

    module = db.query(Module).filter(Module.id == module_id).first()
    if not module:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Module with ID '{module_id}' not found",
        )

    return [
        AnimationCheckpointResponse(
            id=cp.id,
            module_id=cp.module_id,
            timestamp_seconds=cp.timestamp_seconds,
            checkpoint_time_seconds=cp.timestamp_seconds,
            question_id=cp.id,
            question_text=cp.question_text,
            options=cp.options,
            correct_option=cp.correct_option,
            correct_option_index=cp.correct_option,
        )
        for cp in module.checkpoints
    ]


@router.post("/evaluate", response_model=QuizEvaluateResponse)
def evaluate_checkpoint_answer(
    eval_in: QuizEvaluateRequest, db: Session = Depends(get_db)
):
    try:
        uuid.UUID(str(eval_in.checkpoint_id))
    except (ValueError, TypeError, AttributeError):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid UUID format for checkpoint ID",
        )

    cp = (
        db.query(AnimationCheckpoint)
        .filter(AnimationCheckpoint.id == eval_in.checkpoint_id)
        .first()
    )
    if not cp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"AnimationCheckpoint with ID '{eval_in.checkpoint_id}' not found",
        )

    is_correct = eval_in.selected_option == cp.correct_option
    return QuizEvaluateResponse(
        is_correct=is_correct,
        correct_option=cp.correct_option,
        explanation=f"Correct answer is: {cp.options[cp.correct_option] if 0 <= cp.correct_option < len(cp.options) else ''}",
    )


@router.post(
    "/checkpoints",
    response_model=AnimationCheckpointResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_checkpoint(cp_in: AnimationCheckpointCreate, db: Session = Depends(get_db)):
    try:
        uuid.UUID(str(cp_in.module_id))
    except (ValueError, TypeError, AttributeError):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid module_id UUID",
        )

    module = db.query(Module).filter(Module.id == cp_in.module_id).first()
    if not module:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Module with ID '{cp_in.module_id}' not found",
        )

    cp = AnimationCheckpoint(
        module_id=cp_in.module_id,
        timestamp_seconds=cp_in.timestamp_seconds,
        question_text=cp_in.question_text,
        options=cp_in.options,
        correct_option=cp_in.correct_option,
    )
    db.add(cp)
    db.commit()
    db.refresh(cp)

    return AnimationCheckpointResponse(
        id=cp.id,
        module_id=cp.module_id,
        timestamp_seconds=cp.timestamp_seconds,
        checkpoint_time_seconds=cp.timestamp_seconds,
        question_id=cp.id,
        question_text=cp.question_text,
        options=cp.options,
        correct_option=cp.correct_option,
        correct_option_index=cp.correct_option,
    )
