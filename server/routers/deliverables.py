
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid

from .. import crud, schemas
from ..database import get_db

router = APIRouter()

@router.put("/{deliverable_id}", response_model=schemas.Deliverable)
def update_deliverable(deliverable_id: uuid.UUID, deliverable: schemas.DeliverableCreate, db: Session = Depends(get_db)):
    db_deliverable = crud.update_deliverable(db, deliverable_id=deliverable_id, deliverable=deliverable)
    if db_deliverable is None:
        raise HTTPException(status_code=404, detail="Deliverable not found")
    return db_deliverable
