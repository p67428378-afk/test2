import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server import crud, schemas, models
from server.database import get_db
from server.services.swiss_engine import generate_pairings_for_round

router = APIRouter()


@router.post(
    "/tournaments/{id}/rounds/pairings",
    response_model=schemas.RoundResponse,
    status_code=status.HTTP_201_CREATED,
)
def generate_round_pairings_endpoint(
    id: uuid.UUID,
    db: Session = Depends(get_db),
):
    tournament = crud.get_tournament(db, id)
    if not tournament:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tournament not found",
        )

    try:
        new_round = generate_pairings_for_round(id, db)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    # Enrich response with player names if available
    matches = (
        db.query(models.Match)
        .filter(models.Match.round_id == new_round.id)
        .order_by(models.Match.board_number)
        .all()
    )

    match_responses = []
    for m in matches:
        w_name = m.white_player.full_name if m.white_player else None
        b_name = m.black_player.full_name if m.black_player else None
        match_responses.append(
            schemas.MatchResponse(
                id=m.id,
                round_id=m.round_id,
                board_number=m.board_number,
                white_player_id=m.white_player_id,
                black_player_id=m.black_player_id,
                white_player_name=w_name,
                black_player_name=b_name,
                result=m.result,
                is_bye=m.is_bye,
            )
        )

    return schemas.RoundResponse(
        id=new_round.id,
        tournament_id=new_round.tournament_id,
        round_number=new_round.round_number,
        is_closed=new_round.is_closed,
        matches=match_responses,
    )


@router.get(
    "/tournaments/{id}/rounds",
    response_model=List[schemas.RoundResponse],
)
def list_tournament_rounds_endpoint(
    id: uuid.UUID,
    db: Session = Depends(get_db),
):
    tournament = crud.get_tournament(db, id)
    if not tournament:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tournament not found",
        )

    rounds = (
        db.query(models.Round)
        .filter(models.Round.tournament_id == id)
        .order_by(models.Round.round_number)
        .all()
    )

    result = []
    for r in rounds:
        matches = (
            db.query(models.Match)
            .filter(models.Match.round_id == r.id)
            .order_by(models.Match.board_number)
            .all()
        )
        match_responses = [
            schemas.MatchResponse(
                id=m.id,
                round_id=m.round_id,
                board_number=m.board_number,
                white_player_id=m.white_player_id,
                black_player_id=m.black_player_id,
                white_player_name=m.white_player.full_name if m.white_player else None,
                black_player_name=m.black_player.full_name if m.black_player else None,
                result=m.result,
                is_bye=m.is_bye,
            )
            for m in matches
        ]
        result.append(
            schemas.RoundResponse(
                id=r.id,
                tournament_id=r.tournament_id,
                round_number=r.round_number,
                is_closed=r.is_closed,
                matches=match_responses,
            )
        )

    return result
