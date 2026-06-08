from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from server import crud, schemas
from server.database import get_db

router = APIRouter()


@router.post("/", response_model=schemas.SnackRequest)
def request_snack(request: schemas.SnackRequestCreate, db: Session = Depends(get_db)):
    return crud.create_snack_request(db=db, request=request)


@router.get("/", response_model=list[schemas.Snack])
def read_snacks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    snacks = crud.get_snacks(db, skip=skip, limit=limit)
    return snacks
