from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import crud, schemas, models, dependencies

router = APIRouter()

@router.get("/", response_model=List[schemas.Account])
def read_accounts(current_user: models.User = Depends(dependencies.get_current_user), db: Session = Depends(dependencies.get_db)):
    accounts = crud.get_accounts_by_user_id(db, user_id=current_user.id)
    return accounts
