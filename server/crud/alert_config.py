
from sqlalchemy.orm import Session
from server.models.alert_config import AlertConfig
from server.schemas.alert_config import AlertConfigCreate, AlertConfigUpdate
import uuid

def create_alert_config(db: Session, config: AlertConfigCreate):
    db_config = AlertConfig(**config.dict())
    db.add(db_config)
    db.commit()
    db.refresh(db_config)
    return db_config

def get_alert_config(db: Session, user_id: uuid.UUID):
    return db.query(AlertConfig).filter(AlertConfig.user_id == user_id).first()

def update_alert_config(db: Session, user_id: uuid.UUID, config: AlertConfigUpdate):
    db_config = get_alert_config(db, user_id)
    if db_config:
        for key, value in config.dict().items():
            setattr(db_config, key, value)
        db.commit()
        db.refresh(db_config)
    return db_config
