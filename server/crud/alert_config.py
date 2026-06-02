
from sqlalchemy.orm import Session
from server.models.alert_config import AlertConfig
from server.schemas.alert_config import AlertConfigCreate, AlertConfig as AlertConfigSchema
from uuid import UUID

def get_alert_config(db: Session, user_id: UUID):
    return db.query(AlertConfig).filter(AlertConfig.user_id == user_id).first()

def create_alert_config(db: Session, alert_config: AlertConfigCreate):
    db_alert_config = AlertConfig(**alert_config.dict())
    db.add(db_alert_config)
    db.commit()
    db.refresh(db_alert_config)
    return db_alert_config

def update_alert_config(db: Session, user_id: UUID, alert_config: AlertConfigSchema):
    db_alert_config = get_alert_config(db, user_id)
    if db_alert_config:
        for key, value in alert_config.dict(exclude_unset=True).items():
            setattr(db_alert_config, key, value)
        db.commit()
        db.refresh(db_alert_config)
    return db_alert_config
