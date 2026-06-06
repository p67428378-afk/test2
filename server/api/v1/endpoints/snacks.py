
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from server import crud, schemas
from server.database import get_db

router = APIRouter()

@router.post("/", response_model=schemas.SnackRequestResponse)
def request_snack(request: schemas.SnackRequestCreate, db: Session = Depends(get_db)):
    db_request = crud.create_snack_request(db, request=request)
    return {"request_id": db_request.id, "message": "Snack request received"}
