
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from server.app.crud import crud_position
from server.app.schemas.position import Position
from server.app.db.session import SessionLocal
import uuid

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/{trader_id}", response_model=List[Position])
def read_positions(trader_id: uuid.UUID, db: Session = Depends(get_db)):
    positions = crud_position.get_positions_by_trader(db, trader_id=trader_id)
    return positions
