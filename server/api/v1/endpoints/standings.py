import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server import crud, schemas
from server.database import get_db
from server.services.tiebreak_calculator import recalculate_standings

router = APIRouter()


@router.get(
    "/tournaments/{id}/standings",
    response_model=List[schemas.StandingResponse],
)
def get_tournament_standings_endpoint(
    id: uuid.UUID,
    db: Session = Depends(get_db),
):
    tournament = crud.get_tournament(db, id)
    if not tournament:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tournament not found",
        )

    # Recalculate standings dynamically
    standings = recalculate_standings(id, db)

    # Enrich with player details
    response = []
    for s in standings:
        player = crud.get_player(db, s.player_id)
        p_name = player.full_name if player else "Unknown Player"
        p_rating = player.rating if player else 1200
        response.append(
            schemas.StandingResponse(
                rank=s.rank,
                player_id=s.player_id,
                full_name=p_name,
                total_points=s.total_points,
                buchholz=s.buchholz,
                sonneborn_berger=s.sonneborn_berger,
                rating=p_rating,
            )
        )

    return response
