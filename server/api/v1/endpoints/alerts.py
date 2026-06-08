from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from server import crud, schemas
from server.database import get_db

router = APIRouter()

@router.get("/alerts", response_model=List[schemas.AlertResponse])
def read_alerts(db: Session = Depends(get_db)):
    crud.seed_db(db)
    return crud.get_alerts(db)

@router.put("/alerts/{id}/acknowledge", response_model=schemas.AlertAcknowledgeResponse)
def acknowledge_alert(id: UUID, db: Session = Depends(get_db)):
    crud.seed_db(db)
    alert = crud.get_alert(db, id)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    updated_alert = crud.acknowledge_alert(db, id)
    return schemas.AlertAcknowledgeResponse(
        id=updated_alert.id,
        status=updated_alert.status
    )
