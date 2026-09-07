from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.schemas import ScoreEntryCreate, ScoreEntryResponse
from server import crud

router = APIRouter(tags=["Scores"])


@router.post(
    "/sessions/{session_id}/scores",
    response_model=ScoreEntryResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Submit points for a player in a session",
)
def submit_score_entry(
    session_id: str, score_in: ScoreEntryCreate, db: Session = Depends(get_db)
):
    """Record a score entry for a player within a game session."""
    session = crud.get_session(db=db, session_id=session_id)
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Game session with id '{session_id}' not found",
        )

    player = crud.get_player(db=db, player_id=score_in.player_id)
    if not player or player.session_id != session_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Player with id '{score_in.player_id}' not found in session '{session_id}'",
        )

    return crud.create_score_entry(db=db, session_id=session_id, score_in=score_in)


@router.get(
    "/sessions/{session_id}/scores",
    response_model=List[ScoreEntryResponse],
    status_code=status.HTTP_200_OK,
    summary="List all score entries for a game session",
)
def list_session_scores(session_id: str, db: Session = Depends(get_db)):
    """Retrieve all recorded score entries for the specified session."""
    session = crud.get_session(db=db, session_id=session_id)
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Game session with id '{session_id}' not found",
        )
    return crud.list_score_entries_by_session(db=db, session_id=session_id)


@router.delete(
    "/scores/{score_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a score entry",
)
def delete_score(score_id: str, db: Session = Depends(get_db)):
    """Delete a score entry by ID."""
    success = crud.delete_score_entry(db=db, score_id=score_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Score entry with id '{score_id}' not found",
        )
    return None
