from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import Deck, Quiz
from server.schemas import (
    QuizStartRequest,
    QuizStartResponse,
    QuizSubmitRequest,
    QuizSubmitResponse,
    CardQuizResponse,
)

router = APIRouter(prefix="/api/v1/quizzes", tags=["Quizzes"])


@router.post("", response_model=QuizStartResponse)
def start_quiz(request: QuizStartRequest, db: Session = Depends(get_db)):
    deck = db.query(Deck).filter(Deck.id == request.deck_id).first()
    if not deck:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Deck not found"
        )

    if not deck.cards:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot start a quiz on an empty deck. Please add cards first.",
        )

    # Create a quiz session record with placeholder score
    quiz = Quiz(deck_id=deck.id, score=0, total_cards=len(deck.cards))
    db.add(quiz)
    db.commit()
    db.refresh(quiz)

    cards_response = [
        CardQuizResponse(id=card.id, front=card.front) for card in deck.cards
    ]

    return QuizStartResponse(
        quiz_id=quiz.id,
        deck_id=quiz.deck_id,
        total_cards=quiz.total_cards,
        cards=cards_response,
    )


@router.post(
    "/{quiz_id}/submit",
    response_model=QuizSubmitResponse,
    status_code=status.HTTP_201_CREATED,
)
def submit_quiz(
    quiz_id: str, request: QuizSubmitRequest, db: Session = Depends(get_db)
):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Quiz session not found"
        )

    if request.score < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Score cannot be negative"
        )

    if request.score > request.total_cards:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Score cannot exceed total cards",
        )

    quiz.score = request.score
    quiz.total_cards = request.total_cards
    db.commit()
    db.refresh(quiz)

    return quiz
