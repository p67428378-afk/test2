from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.schemas import PlayerCreate, PlayerResponse
from server import crud

router = APIRouter(tags=["Players"])


@router.post(
    "/sessions/{session_id}/players",
    response_model=PlayerResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add a player to a game session",
)
def add_player_to_session(
    session_id: str, player_in: PlayerCreate, db: Session = Depends(get_db)
):
    """Register a new player to the specified game session."""
    session = crud.get_session(db=db, session_id=session_id)
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Game session with id '{session_id}' not found",
        )
    return crud.create_player(db=db, session_id=session_id, player_in=player_in)


@router.get(
    "/sessions/{session_id}/players",
    response_model=List[PlayerResponse],
    status_code=status.HTTP_200_OK,
    summary="List active players in a game session",
)
def list_session_players(session_id: str, db: Session = Depends(get_db)):
    """Retrieve all players participating in a game session."""
    session = crud.get_session(db=db, session_id=session_id)
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Game session with id '{session_id}' not found",
        )
    return crud.list_players_by_session(db=db, session_id=session_id)


@router.delete(
    "/sessions/{session_id}/players/{player_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Remove a player from a session",
)
def delete_player_from_session(
    session_id: str, player_id: str, db: Session = Depends(get_db)
):
    """Remove a player from a session by ID."""
    player = crud.get_player(db=db, player_id=player_id)
    if not player or player.session_id != session_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Player with id '{player_id}' not found in session '{session_id}'",
        )
    crud.delete_player(db=db, player_id=player_id)
    return None


@router.delete(
    "/players/{player_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a player directly",
)
def delete_player_direct(player_id: str, db: Session = Depends(get_db)):
    """Delete a player by ID directly."""
    player = crud.get_player(db=db, player_id=player_id)
    if not player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Player with id '{player_id}' not found",
        )
    crud.delete_player(db=db, player_id=player_id)
    return None
