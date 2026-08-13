from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server import crud, schemas, models
from server.database import get_db
from server.services.tiebreak_calculator import recalculate_standings

router = APIRouter()


@router.post(
    "/scores",
    response_model=schemas.MatchResponse,
)
def submit_score_endpoint(
    score_in: schemas.MatchResultSubmit,
    db: Session = Depends(get_db),
):
    valid_results = ["1-0", "0-1", "0.5-0.5", "BYE"]
    if score_in.result not in valid_results:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid match result. Must be one of {valid_results}",
        )

    match = crud.get_match(db, score_in.match_id)
    if not match:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Match not found",
        )

    round_obj = crud.get_round(db, match.round_id)
    if not round_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Associated round not found",
        )

    original_result = match.result

    # Audit log if modifying an already submitted score
    if original_result != "PENDING" and original_result != score_in.result:
        audit_entry = models.AuditLog(
            admin_id="organizer-admin",
            match_id=match.id,
            original_score=original_result,
            new_score=score_in.result,
        )
        db.add(audit_entry)

    match.result = score_in.result
    db.commit()
    db.refresh(match)

    # Recalculate tournament standings
    recalculate_standings(round_obj.tournament_id, db)

    w_name = match.white_player.full_name if match.white_player else None
    b_name = match.black_player.full_name if match.black_player else None

    return schemas.MatchResponse(
        id=match.id,
        round_id=match.round_id,
        board_number=match.board_number,
        white_player_id=match.white_player_id,
        black_player_id=match.black_player_id,
        white_player_name=w_name,
        black_player_name=b_name,
        result=match.result,
        is_bye=match.is_bye,
    )
