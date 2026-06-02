
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from server.schemas.alert_config import AlertConfig, AlertConfigCreate
from server.crud import alert_config as crud_alert_config
from server.database import get_db
from uuid import UUID

router = APIRouter()

@router.post("/config", response_model=AlertConfig)
def create_alert_config(alert_config: AlertConfigCreate, db: Session = Depends(get_db)):
    return crud_alert_config.create_alert_config(db=db, alert_config=alert_config)

@router.get("/config/{user_id}", response_model=AlertConfig)
def read_alert_config(user_id: UUID, db: Session = Depends(get_db)):
    db_alert_config = crud_alert_config.get_alert_config(db, user_id=user_id)
    if db_alert_config is None:
        raise HTTPException(status_code=404, detail="Configuration not found for the user")
    return db_alert_config

@router.put("/config/{user_id}", response_model=AlertConfig)
def update_alert_config(user_id: UUID, alert_config: AlertConfig, db: Session = Depends(get_db)):
    db_alert_config = crud_alert_config.update_alert_config(db, user_id=user_id, alert_config=alert_config)
    if db_alert_config is None:
        raise HTTPException(status_code=404, detail="Configuration not found for the user")
    return db_alert_config
