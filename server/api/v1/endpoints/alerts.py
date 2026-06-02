
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from server.crud import alert_config as crud_alert_config
from server.schemas import alert_config as schema_alert_config
from server.database import get_db
import uuid

router = APIRouter()

@router.post("/alerts/config", response_model=schema_alert_config.AlertConfig)
def create_alert_config(config: schema_alert_config.AlertConfigCreate, db: Session = Depends(get_db)):
    db_config = crud_alert_config.get_alert_config(db, user_id=config.user_id)
    if db_config:
        raise HTTPException(status_code=409, detail="Configuration for this user already exists")
    return crud_alert_config.create_alert_config(db=db, config=config)

@router.get("/alerts/config/{user_id}", response_model=schema_alert_config.AlertConfig)
def read_alert_config(user_id: uuid.UUID, db: Session = Depends(get_db)):
    db_config = crud_alert_config.get_alert_config(db, user_id=user_id)
    if db_config is None:
        raise HTTPException(status_code=404, detail="Configuration not found for the user")
    return db_config

@router.put("/alerts/config/{user_id}", response_model=schema_alert_config.AlertConfig)
def update_alert_config(user_id: uuid.UUID, config: schema_alert_config.AlertConfigUpdate, db: Session = Depends(get_db)):
    db_config = crud_alert_config.update_alert_config(db, user_id=user_id, config=config)
    if db_config is None:
        raise HTTPException(status_code=404, detail="Configuration not found for the user")
    return db_config
