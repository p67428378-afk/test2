
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from server.crud import user as crud_user
from server.schemas import user as schema_user
from server.database import get_db
import uuid

router = APIRouter()

@router.post("/users/register", response_model=schema_user.User)
def register_user(user: schema_user.UserCreate, db: Session = Depends(get_db)):
    db_user = crud_user.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=409, detail="User with this email already exists")
    return crud_user.create_user(db=db, user=user)

@router.get("/users/{user_id}", response_model=schema_user.User)
def read_user(user_id: uuid.UUID, db: Session = Depends(get_db)):
    db_user = crud_user.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user
