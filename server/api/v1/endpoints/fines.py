from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from server import schemas, crud, models
from server.database import get_db
from server.api.v1.endpoints.auth import get_current_user, get_current_librarian
from typing import List, Optional
from uuid import UUID

router = APIRouter()


@router.get("/fines", response_model=List[schemas.FineResponse])
def read_fines(
    skip: int = 0,
    limit: int = 100,
    status_filter: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db),
    current_librarian: models.User = Depends(get_current_librarian),
):
    query = db.query(models.Fine)
    if status_filter:
        query = query.filter(models.Fine.status.ilike(f"%{status_filter}%"))
    return query.offset(skip).limit(limit).all()


@router.get("/fines/member/{member_id}", response_model=List[schemas.FineResponse])
def read_member_fines(
    member_id: UUID,
    status_filter: Optional[str] = Query(None, alias="status"),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.role != "librarian" and current_user.id != member_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to view this member's fines",
        )
    return crud.get_member_fines(
        db, member_id=member_id, status=status_filter, skip=skip, limit=limit
    )


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
    if db_fine.status.upper() == "PAID":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Fine has already been paid"
        )
    return crud.pay_fine(db, db_fine=db_fine)
