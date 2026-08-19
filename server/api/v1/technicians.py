from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from server.database import get_db
from server.schemas.user import UserResponse
from server.services import user_service

router = APIRouter(prefix="/technicians", tags=["Technicians"])


@router.get("", response_model=List[UserResponse])
def get_technicians(db: Session = Depends(get_db)):
    return user_service.get_active_technicians(db)
