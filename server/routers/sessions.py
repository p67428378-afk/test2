from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.schemas import (
    GameSessionCreate,
    GameSessionUpdate,
    GameSessionResponse,
    LeaderboardResponse,
)
from server import crud

router = APIRouter(prefix="/sessions", tags=["Game Sessions"])


@router.post(
    "",
    response_model=GameSessionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new game session",
)
def create_new_session(session_in: GameSessionCreate, db: Session = Depends(get_db)):
    """Create a new game session with a given game name."""
    return crud.create_session(db=db, session_in=session_in)


@router.get(
    "",
    response_model=List[GameSessionResponse],
    status_code=status.HTTP_200_OK,
    summary="List all game sessions",
)
def list_all_sessions(
    skip: int = Query(0, ge=0, description="Offset for pagination"),
    limit: int = Query(50, ge=1, le=100, description="Limit for pagination"),
    db: Session = Depends(get_db),
):
    """List game sessions with pagination."""
    return crud.list_sessions(db=db, skip=skip, limit=limit)


@router.get(
    "/{session_id}",
    response_model=GameSessionResponse,
    status_code=status.HTTP_200_OK,
    summary="Get game session details",
)
def get_session_details(session_id: str, db: Session = Depends(get_db)):
    """Retrieve details of a specific game session by ID."""
    session = crud.get_session(db=db, session_id=session_id)
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Game session with id '{session_id}' not found",
        )
    return session


@router.patch(
    "/{session_id}",
    response_model=GameSessionResponse,
    status_code=status.HTTP_200_OK,
    summary="Update game session status or name",
)
def update_session(
    session_id: str, session_update: GameSessionUpdate, db: Session = Depends(get_db)
):
    """Update name or status (e.g. active / completed) of a game session."""
    session = crud.update_session(
        db=db, session_id=session_id, session_update=session_update
    )
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Game session with id '{session_id}' not found",
        )
    return session


@router.delete(
    "/{session_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a game session",
)
def delete_session(session_id: str, db: Session = Depends(get_db)):
    """Delete a game session and its associated players and score entries."""
    success = crud.delete_session(db=db, session_id=session_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Game session with id '{session_id}' not found",
        )
    return None


@router.get(
    "/{session_id}/leaderboard",
    response_model=LeaderboardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get ranked leaderboard & winner declaration for a session",
)
def get_leaderboard(session_id: str, db: Session = Depends(get_db)):
    """Calculate and return the ranked leaderboard for a session, highlighting the winner(s)."""
    leaderboard = crud.calculate_leaderboard(db=db, session_id=session_id)
    if not leaderboard:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Game session with id '{session_id}' not found",
        )
    return leaderboard
