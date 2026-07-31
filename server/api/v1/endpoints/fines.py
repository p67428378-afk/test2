from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server import schemas, crud, models
from server.database import get_db
from server.api.v1.endpoints.auth import get_current_librarian
from typing import List
from uuid import UUID

router = APIRouter()


@router.get("/fines", response_model=List[schemas.FineResponse])
def read_fines(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_librarian: models.User = Depends(get_current_librarian),
):
    # Return outstanding fines or all fines?
    # The HLD says "Get a list of all outstanding fines". Let's filter by status 'outstanding'.
    fines = (
        db.query(models.Fine)
        .filter(models.Fine.status == "outstanding")
        .offset(skip)
        .limit(limit)
        .all()
    )
    return fines


@router.post("/fines/{fine_id}/pay", response_model=schemas.FineResponse)
def pay_fine(
    fine_id: UUID,
    db: Session = Depends(get_db),
    current_librarian: models.User = Depends(get_current_librarian),
):
    db_fine = db.query(models.Fine).filter(models.Fine.id == fine_id).first()
    if not db_fine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Fine record not found"
        )
    if db_fine.status == "paid":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Fine has already been paid"
        )
    return crud.pay_fine(db, db_fine=db_fine)
