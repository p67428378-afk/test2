import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server import crud, schemas
from server.database import get_db
from server.services.certificate_service import issue_certificates_for_tournament

router = APIRouter()


@router.post(
    "/tournaments",
    response_model=schemas.TournamentResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_tournament_endpoint(
    tournament_in: schemas.TournamentCreate,
    db: Session = Depends(get_db),
):
    tournament = crud.create_tournament(db, tournament_in)
    return tournament


@router.get("/tournaments", response_model=List[schemas.TournamentResponse])
def list_tournaments_endpoint(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    return crud.list_tournaments(db, skip=skip, limit=limit)


@router.get(
    "/tournaments/{id}",
    response_model=schemas.TournamentResponse,
)
def get_tournament_endpoint(
    id: uuid.UUID,
    db: Session = Depends(get_db),
):
    tournament = crud.get_tournament(db, id)
    if not tournament:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tournament not found",
        )
    return tournament


@router.post("/tournaments/{id}/finish")
def finish_tournament_endpoint(
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
        certificates = issue_certificates_for_tournament(id, db)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    return {
        "message": f"Tournament '{tournament.name}' concluded successfully",
        "status": "COMPLETED",
        "issued_certificates_count": len(certificates),
        "certificates": [
            {
                "verification_uuid": str(c.verification_uuid),
                "player_id": str(c.player_id),
                "rank": c.rank,
                "total_points": c.total_points,
                "qr_code_url": c.qr_code_url,
            }
            for c in certificates
        ],
    }
