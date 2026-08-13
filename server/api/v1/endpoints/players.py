import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from server import crud, schemas
from server.database import get_db

router = APIRouter()


@router.post(
    "/players",
    response_model=schemas.PlayerResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_player_global(
    player_in: schemas.PlayerCreate,
    tournament_id: Optional[uuid.UUID] = Query(None),
    db: Session = Depends(get_db),
):
    target_tournament_id = player_in.tournament_id or tournament_id

    # If no tournament_id provided, look up the latest tournament or error
    if not target_tournament_id:
        tournaments = crud.list_tournaments(db, limit=1)
        if not tournaments:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No active tournament found to register player",
            )
        target_tournament_id = tournaments[0].id

    tournament = crud.get_tournament(db, target_tournament_id)
    if not tournament:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tournament not found",
        )

    try:
        player = crud.register_player(db, player_in, target_tournament_id)
        return player
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.post(
    "/tournaments/{id}/players",
    response_model=schemas.PlayerResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_player_for_tournament(
    id: uuid.UUID,
    player_in: schemas.PlayerCreate,
    db: Session = Depends(get_db),
):
    tournament = crud.get_tournament(db, id)
    if not tournament:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tournament not found",
        )

    try:
        player = crud.register_player(db, player_in, id)
        return player
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.get(
    "/tournaments/{id}/players",
    response_model=List[schemas.RosterPlayerResponse],
)
def get_tournament_roster(
    id: uuid.UUID,
    db: Session = Depends(get_db),
):
    tournament = crud.get_tournament(db, id)
    if not tournament:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tournament not found",
        )

    players = crud.get_tournament_players(db, id)
    return players
