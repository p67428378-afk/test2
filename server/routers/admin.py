from typing import List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from server.database import get_db
from server import crud, schemas

router = APIRouter()


@router.get("/admin/items", response_model=List[schemas.AdminItemResponse])
def admin_list_items(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1),
    db: Session = Depends(get_db),
):
    return crud.list_items(db, skip=skip, limit=limit)


@router.get("/admin/claims", response_model=List[schemas.AdminClaimResponse])
def admin_list_claims(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1),
    db: Session = Depends(get_db),
):
    return crud.list_claims(db, skip=skip, limit=limit)
